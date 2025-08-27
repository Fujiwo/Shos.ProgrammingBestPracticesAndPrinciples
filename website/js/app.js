document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const content = document.getElementById('content')
    const pageName = '第0章 はじめに'
    renderMarkDown(`../MarkDown/${pageName}.md`, content)
}
