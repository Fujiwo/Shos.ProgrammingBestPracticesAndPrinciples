// Application state
let currentPage = '';
let navigationData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Load navigation
        await loadNavigation();
        
        // Setup event listeners
        setupEventListeners();
        
        // Load default page (table of contents)
        await loadPage('目次');
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('アプリケーションの初期化中にエラーが発生しました。');
    }
}

function setupEventListeners() {
    // Sidebar toggle for mobile
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.sidebar');
    
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

async function loadNavigation() {
    try {
        // Load table of contents to build navigation
        const tocContent = await fetchMarkdownFile('目次');
        if (tocContent) {
            buildNavigation(tocContent);
        }
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

function buildNavigation(tocContent) {
    const navContent = document.getElementById('navContent');
    const lines = tocContent.split('\n');
    
    let navHTML = '<ul>';
    let currentSection = '';
    
    // Add table of contents link
    navHTML += '<li><a href="#" onclick="loadPage(\'目次\')" class="nav-link" data-page="目次">📋 目次</a></li>';
    navHTML += '<li><a href="#" onclick="loadPage(\'表紙\')" class="nav-link" data-page="表紙">📖 表紙</a></li>';
    
    // Parse the table of contents
    for (let line of lines) {
        line = line.trim();
        
        // Main chapters and sections
        if (line.startsWith('## 第') && line.includes('部:')) {
            // Section header
            const sectionName = line.replace(/^##\s*/, '');
            navHTML += `<li><strong>${sectionName}</strong><ul class="chapter-nav">`;
            currentSection = 'chapter';
        } else if (line.startsWith('### 第') && line.includes('章')) {
            // Chapter
            const chapterMatch = line.match(/第(\d+)章\s*(.+)/);
            if (chapterMatch) {
                const chapterNum = chapterMatch[1];
                const chapterTitle = chapterMatch[2];
                const filename = `第${chapterNum}章_${chapterTitle.replace(/\s+/g, '')}`;
                navHTML += `<li><a href="#" onclick="loadPage('${filename}')" class="nav-link" data-page="${filename}">第${chapterNum}章 ${chapterTitle}</a></li>`;
            }
        } else if (line.startsWith('## 第0章')) {
            // Introduction chapter
            navHTML += '<li><a href="#" onclick="loadPage(\'第0章 はじめに\')" class="nav-link" data-page="第0章 はじめに">第0章 はじめに</a></li>';
        } else if (line.startsWith('### 第11章')) {
            // Final chapter
            navHTML += '<li><a href="#" onclick="loadPage(\'第11章_終わりに\')" class="nav-link" data-page="第11章_終わりに">第11章 終わりに</a></li>';
        } else if (line.startsWith('## 付録')) {
            // Appendix section
            if (currentSection === 'chapter') {
                navHTML += '</ul></li>'; // Close previous section
            }
            navHTML += '<li><strong>付録</strong><ul class="chapter-nav">';
            currentSection = 'appendix';
        } else if (line.startsWith('- **付録') && line.includes('**')) {
            // Appendix items
            const appendixMatch = line.match(/付録([A-F])\s*(.+?)\*\*/);
            if (appendixMatch) {
                const appendixLetter = appendixMatch[1];
                const appendixTitle = appendixMatch[2].replace(/[　\s]+/, ' ').trim();
                const filename = `付録${appendixLetter}_${appendixTitle}`;
                navHTML += `<li><a href="#" onclick="loadPage('${filename}')" class="nav-link" data-page="${filename}">付録${appendixLetter} ${appendixTitle}</a></li>`;
            }
        }
    }
    
    // Close any open sections
    if (currentSection) {
        navHTML += '</ul></li>';
    }
    
    navHTML += '</ul>';
    
    navContent.innerHTML = navHTML;
}

async function loadPage(pageName) {
    console.log('Loading page:', pageName);
    
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    // Show loading state
    loading.style.display = 'block';
    content.style.display = 'none';
    
    try {
        // Fetch markdown content
        const markdownContent = await fetchMarkdownFile(pageName);
        
        if (markdownContent) {
            // Convert markdown to HTML using our simple parser
            let htmlContent = markdownParser.parse(markdownContent);
            
            // Process image paths
            htmlContent = processImagePaths(htmlContent);
            
            // Set content
            content.innerHTML = htmlContent;
            
            // Highlight code blocks
            highlightCodeBlocks();
            
            // Update navigation state
            updateNavigationState(pageName);
            
            // Update page title
            updatePageTitle(pageName);
            
            currentPage = pageName;
        } else {
            showError(`ページ "${pageName}" が見つかりませんでした。`);
        }
        
    } catch (error) {
        console.error('Error loading page:', error);
        showError(`ページの読み込み中にエラーが発生しました: ${error.message}`);
    } finally {
        // Hide loading state
        loading.style.display = 'none';
        content.style.display = 'block';
        
        // Close mobile sidebar
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar').classList.remove('open');
        }
    }
}

async function fetchMarkdownFile(filename) {
    try {
        console.log('Getting embedded content for:', filename);
        
        // Get content from embedded JavaScript
        const content = getMarkdownContent(filename);
        
        if (content) {
            console.log('Successfully loaded embedded content for:', filename);
            return content;
        }
        
        throw new Error(`Content not found: ${filename}`);
        
    } catch (error) {
        console.error('Error getting markdown content:', error);
        throw error;
    }
}

function processImagePaths(htmlContent) {
    // Update image paths to point to the correct location
    htmlContent = htmlContent.replace(
        /src="Images\//g,
        'src="../MarkDown/Images/'
    );
    
    // Also handle relative image references without quotes
    htmlContent = htmlContent.replace(
        /\(Images\//g,
        '(../MarkDown/Images/'
    );
    
    return htmlContent;
}

function highlightCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        const className = block.className;
        const language = className.replace('language-', '');
        
        // Basic syntax highlighting for different languages
        if (language === 'csharp' || language === 'cs' || language === 'c#') {
            highlightCSharp(block);
        } else if (language === 'java') {
            highlightJava(block);
        } else if (language === 'javascript' || language === 'js') {
            highlightJavaScript(block);
        } else if (language === 'python' || language === 'py') {
            highlightPython(block);
        }
    });
}

function highlightCSharp(block) {
    let content = block.textContent;
    
    // Keywords
    const keywords = ['public', 'private', 'protected', 'internal', 'static', 'virtual', 'override', 'abstract', 'sealed', 'class', 'interface', 'struct', 'enum', 'namespace', 'using', 'if', 'else', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'base', 'var', 'const', 'readonly', 'bool', 'int', 'string', 'double', 'float', 'decimal', 'char', 'byte', 'long', 'short', 'object'];
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        content = content.replace(regex, `<span style="color: #c792ea;">${keyword}</span>`);
    });
    
    // Strings
    content = content.replace(/"([^"]*)"/g, '<span style="color: #c3e88d;">"$1"</span>');
    
    // Comments
    content = content.replace(/\/\/(.*)/g, '<span style="color: #546e7a;">//$1</span>');
    content = content.replace(/\/\*([\s\S]*?)\*\//g, '<span style="color: #546e7a;">/*$1*/</span>');
    
    block.innerHTML = content;
}

function highlightJava(block) {
    let content = block.textContent;
    
    // Keywords
    const keywords = ['public', 'private', 'protected', 'static', 'final', 'abstract', 'class', 'interface', 'extends', 'implements', 'import', 'package', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'throws', 'new', 'this', 'super', 'boolean', 'int', 'String', 'double', 'float', 'char', 'byte', 'long', 'short', 'void'];
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        content = content.replace(regex, `<span style="color: #c792ea;">${keyword}</span>`);
    });
    
    // Strings
    content = content.replace(/"([^"]*)"/g, '<span style="color: #c3e88d;">"$1"</span>');
    
    // Comments
    content = content.replace(/\/\/(.*)/g, '<span style="color: #546e7a;">//$1</span>');
    content = content.replace(/\/\*([\s\S]*?)\*\//g, '<span style="color: #546e7a;">/*$1*/</span>');
    
    block.innerHTML = content;
}

function highlightJavaScript(block) {
    let content = block.textContent;
    
    // Keywords
    const keywords = ['function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'class', 'extends', 'import', 'export', 'from', 'async', 'await', 'typeof', 'instanceof', 'in', 'of'];
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        content = content.replace(regex, `<span style="color: #c792ea;">${keyword}</span>`);
    });
    
    // Strings
    content = content.replace(/'([^']*)'/g, '<span style="color: #c3e88d;">\'$1\'</span>');
    content = content.replace(/"([^"]*)"/g, '<span style="color: #c3e88d;">"$1"</span>');
    content = content.replace(/`([^`]*)`/g, '<span style="color: #c3e88d;">`$1`</span>');
    
    // Comments
    content = content.replace(/\/\/(.*)/g, '<span style="color: #546e7a;">//$1</span>');
    content = content.replace(/\/\*([\s\S]*?)\*\//g, '<span style="color: #546e7a;">/*$1*/</span>');
    
    block.innerHTML = content;
}

function highlightPython(block) {
    let content = block.textContent;
    
    // Keywords
    const keywords = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'import', 'from', 'return', 'yield', 'break', 'continue', 'pass', 'and', 'or', 'not', 'in', 'is', 'lambda', 'global', 'nonlocal', 'True', 'False', 'None'];
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        content = content.replace(regex, `<span style="color: #c792ea;">${keyword}</span>`);
    });
    
    // Strings
    content = content.replace(/'([^']*)'/g, '<span style="color: #c3e88d;">\'$1\'</span>');
    content = content.replace(/"([^"]*)"/g, '<span style="color: #c3e88d;">"$1"</span>');
    content = content.replace(/"""([\s\S]*?)"""/g, '<span style="color: #c3e88d;">"""$1"""</span>');
    
    // Comments
    content = content.replace(/#(.*)/g, '<span style="color: #546e7a;">#$1</span>');
    
    block.innerHTML = content;
}

function updateNavigationState(pageName) {
    // Remove active class from all navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page
    const currentLink = document.querySelector(`[data-page="${pageName}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}

function updatePageTitle(pageName) {
    const baseTitle = '美しいコードの原則';
    let pageTitle = pageName;
    
    // Clean up the page title
    if (pageName.includes('_')) {
        pageTitle = pageName.replace(/_/g, ' ');
    }
    
    document.title = `${pageTitle} - ${baseTitle}`;
}

function showError(message) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="error-message" style="
            background: #ffebee;
            border: 1px solid #f44336;
            border-radius: 8px;
            padding: 1rem;
            color: #c62828;
            text-align: center;
        ">
            <h3>エラー</h3>
            <p>${message}</p>
            <button onclick="loadPage('目次')" style="
                background: #667eea;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 1rem;
            ">目次に戻る</button>
        </div>
    `;
}

// Make loadPage function globally available
window.loadPage = loadPage;