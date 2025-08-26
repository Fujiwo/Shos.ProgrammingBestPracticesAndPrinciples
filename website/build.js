const fs = require('fs');
const path = require('path');

// Define the directories
const markdownDir = '../MarkDown';
const outputFile = 'js/content.js';

// Function to read all markdown files
function readMarkdownFiles() {
    const content = {};
    
    try {
        const files = fs.readdirSync(markdownDir);
        
        files.forEach(file => {
            if (file.endsWith('.md')) {
                const filePath = path.join(markdownDir, file);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                
                // Use filename without extension as key
                const key = file.replace('.md', '');
                content[key] = fileContent;
                
                console.log(`Loaded: ${file}`);
            }
        });
        
        console.log(`\nTotal files loaded: ${Object.keys(content).length}`);
        return content;
        
    } catch (error) {
        console.error('Error reading markdown files:', error);
        return {};
    }
}

// Function to generate JavaScript file
function generateContentFile(content) {
    const jsContent = `// Auto-generated content file
// This file contains all markdown content embedded as JavaScript
// Generated on: ${new Date().toISOString()}

window.markdownContent = ${JSON.stringify(content, null, 2)};

// Function to get content by filename
window.getMarkdownContent = function(filename) {
    return window.markdownContent[filename] || null;
};

console.log('Loaded markdown content for', Object.keys(window.markdownContent).length, 'files');
`;

    try {
        fs.writeFileSync(outputFile, jsContent, 'utf-8');
        console.log(`\nGenerated ${outputFile}`);
        console.log(`File size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
    } catch (error) {
        console.error('Error writing content file:', error);
    }
}

// Main execution
console.log('Building website content...\n');

const content = readMarkdownFiles();
generateContentFile(content);

console.log('\nBuild complete!');
console.log('Available content keys:');
console.log(Object.keys(content).sort().join(', '));