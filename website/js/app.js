document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

let currentPage = null;

function initializeApp() {
    loadTableOfContents();
    loadPage('第0章 はじめに');
}

function loadTableOfContents() {
    // Load the table of contents markdown file for navigation
    fetch('../MarkDown/目次.md')
        .then(response => response.text())
        .then(content => {
            populateNavigation(content);
            // Also show the table of contents in the main content area
            const mainContent = document.getElementById('content');
            render(content, mainContent);
            // Clear active states
            const navLinks = document.querySelectorAll('.nav-content a');
            navLinks.forEach(link => link.classList.remove('active'));
            currentPage = '目次';
        })
        .catch(error => {
            console.error('Error loading table of contents:', error);
            document.getElementById('nav-content').innerHTML = '<p>目次の読み込みに失敗しました</p>';
        });
}

function populateNavigation(markdownContent) {
    const navContent = document.getElementById('nav-content');
    const lines = markdownContent.split('\n');
    let navHtml = '<ul>';
    
    for (let line of lines) {
        line = line.trim();
        
        // Match chapter links like [第1章 美しいソースコード...](第1章_美しいソースコード....md)
        const chapterMatch = line.match(/^\s*###\s*\[([^\]]+)\]\(([^)]+)\)/);
        if (chapterMatch) {
            const title = chapterMatch[1];
            const filename = decodeURIComponent(chapterMatch[2]).replace('.md', '');
            navHtml += `<li><a href="#" onclick="loadPage('${filename}')">${title}</a></li>`;
        }
        
        // Also match direct chapter references like ## [第0章 はじめに](第0章%20はじめに.md)
        const directChapterMatch = line.match(/^\s*##\s*\[([^\]]+)\]\(([^)]+)\)/);
        if (directChapterMatch) {
            const title = directChapterMatch[1];
            const filename = decodeURIComponent(directChapterMatch[2]).replace('.md', '');
            navHtml += `<li><a href="#" onclick="loadPage('${filename}')">${title}</a></li>`;
        }
    }
    
    navHtml += '</ul>';
    navContent.innerHTML = navHtml;
}

function loadPage(pageName) {
    const content = document.getElementById('content');
    
    // Update active navigation
    const navLinks = document.querySelectorAll('.nav-content a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Find and activate the current page link
    navLinks.forEach(link => {
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(pageName)) {
            link.classList.add('active');
        }
    });
    
    // Show loading state
    content.innerHTML = '<div class="loading">読み込み中...</div>';
    
    // Load the markdown file
    renderMarkDown(`../MarkDown/${pageName}.md`, content);
    currentPage = pageName;
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}
