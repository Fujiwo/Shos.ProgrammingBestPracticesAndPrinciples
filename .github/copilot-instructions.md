# Programming Best Practices and Principles Repository

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

This is a Japanese documentation repository focused on writing a book about programming best practices and principles. The repository contains reference materials and documentation - **there is NO executable code, build processes, or applications to run.**

## Working Effectively

### Repository Overview
- **Purpose**: Writing a book titled "Programming Best Practices and Principles" in Japanese
- **Content**: Reference materials, presentations, and AI-generated summaries about programming principles
- **Language**: Primarily Japanese with some English technical terms
- **Format**: Markdown documentation and reference files

### What You CAN Do
- Navigate and read reference materials in the `参考資料` (reference materials) folder
- Create and edit markdown files for the book project
- Organize documentation and manage the book writing project
- Work with the existing folder structure and file organization

### What You CANNOT Do
- **DO NOT attempt to build or compile anything** - there are no build processes
- **DO NOT look for test suites** - there are no tests to run
- **DO NOT try to run applications** - there are no executable programs
- **DO NOT search for package.json, .csproj, or other build files** - they don't exist

## Navigation and File Structure

### Key Directories
```
/
├── README.md                     # Basic repository description
├── LICENSE                       # MIT License
├── 参考資料/                     # Reference materials folder
│   ├── AIによるまとめ/           # AI-generated summaries
│   ├── 元資料/                   # Original source materials
│   └── 参照用/                   # Reference files
├── 計画と進捗/                   # Planning and progress folder
│   ├── issue.001.md             # Main project specification
│   └── 計画と進捗.md             # Progress tracking
└── MarkDown/                     # Book content (to be created)
```

### Common Navigation Commands
```bash
# Navigate to repository root
cd /home/runner/work/Shos.ProgrammingBestPracticesAndPrinciples/Shos.ProgrammingBestPracticesAndPrinciples

# List all reference materials
find 参考資料 -name "*.md" -o -name "*.txt"

# View repository structure
tree -I '.git'

# Check which markdown files exist
find . -name "*.md" -type f
```

## Working with Reference Materials

### Key Reference Files to Review
1. `計画と進捗/issue.001.md` - Main project specification and requirements
2. `参考資料/AIによるまとめ/*.md` - AI-generated summaries of programming concepts
3. `参考資料/元資料/プログラミングのコツ.txt` - Programming tips and principles
4. `参考資料/元資料/*.pptx` - Original presentation materials (cannot be edited directly)

### Understanding the Content
- The materials focus on "beautiful code" principles, object-oriented programming, and software quality
- Key concepts include "守破離" (Shu-Ha-Ri learning stages), modeling, and naming conventions
- Content emphasizes the "Why-What-How" development approach

## Book Writing Workflow

### Project Requirements (from issue.001.md)
- **Target Audience**: All levels (beginner to advanced)
- **Format**: Markdown files, chapter-based division
- **Language**: Japanese, using だ・である (formal) style
- **Character Encoding**: UTF-8
- **Length**: Detailed (300+ pages)
- **Code Examples**: Include examples in C#, Java, Python, JavaScript

### Workflow Steps
1. **Read Reference Materials**: Start with `参考資料/AIによるまとめ/` files for summaries
2. **Create Outline**: Develop detailed table of contents and chapter summaries
3. **Write Draft**: Create chapter-by-chapter drafts in `MarkDown/` folder
4. **Review and Revise**: Iterate on content with reviews

### File Organization
- Store finished markdown files in `MarkDown/` folder (create if needed)
- Update README.md as appropriate
- Reference source materials when creating content

## Common Tasks

### View Project Status
```bash
# Check git status
git status

# View recent changes
git log --oneline -5

# See all files in reference materials
ls -la 参考資料/*/
```

### Create Book Content Structure
```bash
# Create MarkDown folder if it doesn't exist
mkdir -p MarkDown

# Create chapter structure (example)
mkdir -p MarkDown/chapters
touch MarkDown/目次.md
touch MarkDown/chapters/第1章_プログラミングの基本原則.md
```

### Work with Japanese File Names
- Use UTF-8 encoding for all file operations
- Japanese folder names like `参考資料` and `計画と進捗` are normal
- File commands work the same way with Japanese names

## Validation and Quality Control

### Content Validation
- Always check that new content references appropriate source materials
- Ensure proper citation when using content from reference files
- Maintain consistent Japanese writing style (だ・である体)
- Include code examples as specified in requirements

### No Technical Validation Needed
- **DO NOT run linting tools** - there is no code to lint
- **DO NOT attempt builds** - nothing to build
- **DO NOT look for test failures** - no tests exist
- Simply focus on content quality and organization

## File Type Reference

### Expected File Types
- `.md` - Markdown documentation and book content
- `.txt` - Reference text files
- `.pptx` - Presentation files (read-only reference)
- `.pdf` - PDF reference materials
- Audio/video files - Reference materials from AI tools

### Files You Won't Find
- No `.cs`, `.java`, `.py`, `.js` source code files
- No `package.json`, `.csproj`, `Makefile` build files
- No test files or test frameworks
- No CI/CD workflows or deployment scripts

## Getting Started Checklist

When working in this repository:
1. Read this instruction file completely
2. Review `計画と進捗/issue.001.md` for project requirements
3. Explore reference materials in `参考資料/AIによるまとめ/`
4. Create `MarkDown/` folder if planning to write content
5. Focus on documentation tasks, not code development

**Remember: This is a documentation project. Do not waste time looking for build processes, tests, or applications that do not exist.**