document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

let currentPage = null;

function initializeApp() {
    loadTableOfContents();
    loadPage('chapter-00');
}

function pageNameToUrl(pageName) {
    return `../MarkDown/${encodeURIComponent(pageName)}.md`
}

function loadTableOfContents() {
    // Load the table of contents markdown file for navigation
    fetch(pageNameToUrl('table-of-contents'))
        .then(response => response.text())
        .then(content => {
            populateNavigation(content);
            // Also show the table of contents in the main content area
            const mainContent = document.getElementById('content');
            render(content, mainContent);
            // Clear active states
            const navLinks = document.querySelectorAll('.nav-content a');
            navLinks.forEach(link => link.classList.remove('active'));
            currentPage = 'table-of-contents';
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

// Close sidebar when clicking on navigation links on mobile
function loadPage(pageName) {
    const content = document.getElementById('content');
    
    // Close sidebar on mobile after selecting a page
    if (window.innerWidth <= 768) {
        closeSidebar();
    }
    
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
    renderMarkDown(pageNameToUrl(pageName), content);
    currentPage = pageName;
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('mobile-overlay');
    const isOpen = sidebar.classList.contains('open');
    
    if (isOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('mobile-overlay');
    
    sidebar.classList.add('open');
    overlay.classList.add('active');
    
    // Prevent body scrolling when sidebar is open on mobile
    if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('mobile-overlay');
    
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    
    // Restore body scrolling
    document.body.style.overflow = '';
}

// Close sidebar when clicking on navigation links on mobile
function loadPage(pageName) {
    const content = document.getElementById('content');
    
    // Close sidebar on mobile after selecting a page
    if (window.innerWidth <= 768) {
        closeSidebar();
    }
    
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
    renderMarkDown(pageNameToUrl(pageName), content);
    currentPage = pageName;
}

// Handle window resize to properly manage sidebar state
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        // Reset mobile-specific styles when switching to desktop
        closeSidebar();
        document.body.style.overflow = '';
    }
});
