// Simple fallback markdown to HTML converter
function simpleMarkdownToHtml(text) {
    return text
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Code blocks (regular ones) - must come before inline code
        .replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
            const langClass = lang ? ` class="language-${lang}"` : '';
            return `<pre><code${langClass}>${code}</code></pre>`;
        })
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Inline code
        .replace(/`(.*?)`/g, '<code>$1</code>')
        // Line breaks
        .replace(/\n/g, '<br>');
};

function convertMermaidBlocks(text) {
    return text.replace(/```mermaid([\s\S]*?)```/g, (match, content) => {
        // console.log(`'Processing mermaid block match: ${match}, content: ${content}`);
        return `<pre class="mermaid">${content}</pre>`;
    });
}

// Process mermaid and math blocks according to conversion rules
function processSpecialBlocks(markdownText) {
    // console.log('Before mermaid processing:', markdownText);

    // console.log('index: ' + markdownText.indexOf('```mermaid'))

    // Rule 1: Convert ```mermaid\n(content)\n``` to <pre class="mermaid">(content)</pre>
    // markdownText = markdownText.replace(/```mermaid\n([\s\S]*?)\n```/g, (match, content) => {
    //     console.log(`'Processing mermaid block match: ${match}, content: ${content}`);
    //     return `<pre class="mermaid">${content}</pre>`;
    // });
    markdownText = convertMermaidBlocks(markdownText);
    // console.log('After mermaid processing:', markdownText);

    // Rule 2: Convert ```math\n(content)\n``` to <math>(content)</math>
    markdownText = markdownText.replace(/```math([\s\S]*?)```/g, (match, content) => {
        console.log('Processing math block');
        return `<math>${content}</math>`;
    });
    // console.log('After math processing:', markdownText);
    
    return markdownText;
};

// Function to hide "← 目次に戻る" links as requested in the issue
function hideTableOfContentsReturnLinks(container) {
    // Find all strong elements that contain links with "← 目次に戻る" text
    const strongElements = container.querySelectorAll('strong');
    
    strongElements.forEach(strong => {
        const links = strong.querySelectorAll('a');
        let hasReturnLink = false;
        
        // Check if this strong element contains a return to TOC link
        links.forEach(link => {
            if (link.textContent.includes('← 目次に戻る')) {
                hasReturnLink = true;
            }
        });
        
        // Also check the text content of the strong element directly
        if (strong.textContent.includes('← 目次に戻る')) {
            hasReturnLink = true;
        }
        
        if (hasReturnLink) {
            // Hide the strong element and its parent if it's a paragraph
            strong.style.display = 'none';
            
            // If the parent is a paragraph and it becomes empty, hide it too
            if (strong.parentElement && 
                strong.parentElement.tagName === 'P' && 
                strong.parentElement.textContent.trim() === '') {
                strong.parentElement.style.display = 'none';
            }
        }
    });
    
    // Also look for any remaining direct links
    const allLinks = container.querySelectorAll('a');
    allLinks.forEach(link => {
        if (link.textContent.includes('← 目次に戻る')) {
            // Hide the link and its containing element
            link.style.display = 'none';
            
            // If the parent becomes empty, hide it too
            if (link.parentElement && 
                link.parentElement.textContent.trim() === '') {
                link.parentElement.style.display = 'none';
            }
        }
    });
    
    // Hide any preceding HR elements that might be part of the footer
    const hiddenElements = container.querySelectorAll('[style*="display: none"]');
    hiddenElements.forEach(element => {
        if (element.previousElementSibling && 
            element.previousElementSibling.tagName === 'HR') {
            element.previousElementSibling.style.display = 'none';
        }
    });
}

function render(markdownText, textView) {
    const text = markdownText.trim()

    try {
        // Convert Markdown to HTML with special block processing
        // console.log('[render] Before process markdown:', text);
        const processedMarkdown = processSpecialBlocks(text);
        // console.log('[render] Processed Markdown:', processedMarkdown);

        // Use marked if available, otherwise use simple converter
        const html = (typeof marked !== 'undefined' && marked.parse)
                        ? marked.parse(processedMarkdown)
                        : simpleMarkdownToHtml(processedMarkdown)
        
        console.log('html:', html);
        textView.innerHTML = html;
        
        // Hide "← 目次に戻る" links as requested in the issue
        hideTableOfContentsReturnLinks(textView);
        
        // Trigger Prism.js syntax highlighting after content is updated
        if (window.Prism) {
            setTimeout(() => {
                Prism.highlightAllUnder(textView);
            }, 100);
        } else {
            console.log('Prism.js is not loaded');
        }
        
        // Trigger mermaid rendering after content is updated
        if (window.mermaid) {
            setTimeout(async () => {
                try {
                    // For Mermaid v11+, use run() instead of init()
                    // Clear any existing rendered content in mermaid elements first
                    const mermaidElements = textView.querySelectorAll('.mermaid');
                    console.log('Found mermaid elements:', mermaidElements.length);
                    
                    for (let element of mermaidElements) {
                        // Clear any previous rendering
                        element.removeAttribute('data-processed');
                        element.innerHTML = element.textContent || element.innerText;
                        console.log('Mermaid element content:', element.textContent);
                    }
                    
                    // Use the new run() API for Mermaid v11+
                    if (mermaid.run) {
                        await mermaid.run({ nodes: mermaidElements });
                        console.log('Mermaid rendering completed with run()');
                    } else {
                        // Fallback to init for older versions
                        mermaid.init(undefined, mermaidElements);
                        console.log('Mermaid rendering completed with init()');
                    }
                } catch (error) {
                    console.error('Mermaid rendering error:', error);
                }
            }, 200);
        } else {
            console.log('Mermaid.js is not loaded');
        }
        
        // Trigger MathJax rendering after content is updated
        if (window.MathJax && window.MathJax.typesetPromise) {
            setTimeout(() => {
                MathJax.typesetPromise([textView]).catch((err) => {
                    console.warn('MathJax rendering error:', err);
                });
            }, 200);
        } else {
            console.log('MathJax is not loaded');
        }
    } catch (error) {
        console.log(`Error during conversion: ${error.message}`)
    }
}

function initializeMarkDownRenderer() {
    // Initialize TurndownService for HTML to Markdown conversion (if available)
    let turndownService = null;
    if (typeof TurndownService !== 'undefined') {
        turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            emDelimiter: '*',
            bulletListMarker: '-',
            linkStyle: 'inlined',
            linkReferenceStyle: 'full',
            br: '  \n' // Two spaces followed by newline for line break
        });

        // Ignore style and script elements completely
        turndownService.addRule('ignoreStyleAndScript', {
            filter: ['style', 'script'],
            replacement: () => ''
        });

        // Remove unwanted attributes from HTML elements
        // Focus on getting clean HTML without styles, classes, etc.
        turndownService.addRule('removeAttributes', {
            filter: (node) => {
                // Define a set of node types we want to preserve
                const preserveNodes = new Set([
                    'A', 'IMG', 'UL', 'OL', 'LI', 'BR', 'P',
                    'H1', 'H2', 'H3', 'H4', 'H5', 'H6'
                ]);
                
                // Only target nodes where we want to remove attributes but preserve structure
                return !preserveNodes.has(node.nodeName);
            },
            replacement: (content, node) => {
                if (node.nodeName === 'PRE') {
                    return '\n```\n' + content + '\n```\n';
                }
                return content;
            }
        });
        
        // Add support for HTML tables
        turndownService.addRule('tableRule', {
            filter: ['table'],
            replacement: (content, node) => {
                // Process the table by rows
                const rows = node.querySelectorAll('tr');
                if (rows.length === 0) return content;

                const markdownTable = [];
                const headerSeparator = [];
                
                // Process each row
                [...rows].forEach((row, i) => {
                    const cells = row.querySelectorAll('th, td');
                    const isHeaderRow = row.parentNode.tagName === 'THEAD' || 
                                    (i === 0 && row.querySelectorAll('th').length > 0);
                    
                    let markdownRow = '| ';
                    
                    // Process each cell
                    [...cells].forEach((cell, j) => {
                        const cellContent = cell.textContent.trim();
                        markdownRow += `${cellContent} | `;
                        
                        // If this is a header row, prepare the separator
                        if (isHeaderRow) {
                            // Create the header separator (using at least 3 dashes)
                            const dashes = '-'.repeat(Math.max(3, cellContent.length));
                            headerSeparator[j] = dashes;
                        }
                    });
                    
                    // Add the row to the table
                    markdownTable.push(markdownRow);
                    
                    // If this was the header row, add the separator
                    if (isHeaderRow && headerSeparator.length > 0) {
                        markdownTable.push(`| ${headerSeparator.map(dashes => `${dashes} `).join('| ')}|`);
                    }
                });
                
                // Return the markdown table with an empty line before and after
                return '\n\n' + markdownTable.join('\n') + '\n\n';
            }
        });
    }
}

function readFile(fileName, set) {
    fetch(fileName)
        .then(result => result.ok ? result.text() : Promise.reject(result.status))
        .then(content => set(content))
        .catch(() => set(''))
}

function renderMarkDown(markDownfilePath, container) {
    readFile(markDownfilePath, content => {
        render(content, container)
    })
}
