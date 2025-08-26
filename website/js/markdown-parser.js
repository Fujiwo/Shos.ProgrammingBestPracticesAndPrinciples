// Simple markdown parser
class SimpleMarkdownParser {
    parse(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
        html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
        
        // Code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, lang, code) {
            const language = lang || 'text';
            return `<pre><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>`;
        }.bind(this));
        
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Bold and italic
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
        
        // Horizontal rules
        html = html.replace(/^---$/gm, '<hr>');
        
        // Blockquotes
        html = html.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');
        
        // Lists
        html = this.parseList(html);
        
        // Paragraphs
        html = this.parseParagraphs(html);
        
        // Tables
        html = this.parseTables(html);
        
        return html;
    }
    
    parseList(html) {
        const lines = html.split('\n');
        let result = [];
        let inList = false;
        let listType = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const unorderedMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
            const orderedMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
            
            if (unorderedMatch || orderedMatch) {
                const match = unorderedMatch || orderedMatch;
                const indent = match[1];
                const content = match[2];
                const currentListType = unorderedMatch ? 'ul' : 'ol';
                
                if (!inList) {
                    result.push(`<${currentListType}>`);
                    inList = true;
                    listType = currentListType;
                }
                
                result.push(`<li>${content}</li>`);
            } else {
                if (inList) {
                    result.push(`</${listType}>`);
                    inList = false;
                }
                result.push(line);
            }
        }
        
        if (inList) {
            result.push(`</${listType}>`);
        }
        
        return result.join('\n');
    }
    
    parseParagraphs(html) {
        const lines = html.split('\n');
        let result = [];
        let inParagraph = false;
        
        for (let line of lines) {
            const trimmed = line.trim();
            
            if (trimmed === '') {
                if (inParagraph) {
                    result.push('</p>');
                    inParagraph = false;
                }
                result.push('');
            } else if (trimmed.startsWith('<') || trimmed.startsWith('#')) {
                if (inParagraph) {
                    result.push('</p>');
                    inParagraph = false;
                }
                result.push(line);
            } else {
                if (!inParagraph) {
                    result.push('<p>');
                    inParagraph = true;
                }
                result.push(line);
            }
        }
        
        if (inParagraph) {
            result.push('</p>');
        }
        
        return result.join('\n');
    }
    
    parseTables(html) {
        const lines = html.split('\n');
        let result = [];
        let inTable = false;
        let isHeaderRow = true;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
                if (!inTable) {
                    result.push('<table>');
                    inTable = true;
                    isHeaderRow = true;
                }
                
                if (line.match(/^\|\s*[-:]+\s*\|/)) {
                    // Skip separator row
                    isHeaderRow = false;
                    continue;
                }
                
                const cells = line.split('|').slice(1, -1);
                const tag = isHeaderRow ? 'th' : 'td';
                
                if (isHeaderRow) {
                    result.push('<thead><tr>');
                } else if (result[result.length - 1].includes('</thead>')) {
                    result.push('<tbody><tr>');
                } else {
                    result.push('<tr>');
                }
                
                for (let cell of cells) {
                    result.push(`<${tag}>${cell.trim()}</${tag}>`);
                }
                
                if (isHeaderRow) {
                    result.push('</tr></thead>');
                    isHeaderRow = false;
                } else {
                    result.push('</tr>');
                }
            } else {
                if (inTable) {
                    if (result[result.length - 1].includes('<tbody>')) {
                        result.push('</tbody></table>');
                    } else {
                        result.push('</table>');
                    }
                    inTable = false;
                }
                result.push(line);
            }
        }
        
        if (inTable) {
            if (result[result.length - 1].includes('<tbody>')) {
                result.push('</tbody></table>');
            } else {
                result.push('</table>');
            }
        }
        
        return result.join('\n');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Make the parser globally available
window.markdownParser = new SimpleMarkdownParser();