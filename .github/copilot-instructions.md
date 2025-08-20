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
├── README.md                     # Repository description with current status
├── LICENSE                       # MIT License  
├── レビュー結果_001.md           # Review results and improvement plans
├── MarkDown/                     # Book content (5 chapters completed)
│   ├── 目次.md                   # Table of contents
│   ├── 第1章_美しいソースコードの基本原則.md
│   ├── 第2章_命名の重要性とベストプラクティス.md
│   ├── 第3章_モデリングとしてのプログラミング.md
│   ├── 第4章_マルチパラダイムプログラミング.md
│   └── 第5章_オブジェクト指向設計の真髄.md
├── 参考資料/                     # Reference materials folder
│   ├── AIによるまとめ/           # AI-generated summaries
│   ├── 元資料/                   # Original source materials (PPT, etc.)
│   └── 参照用/                   # Reference files (PDF, TXT)
└── 計画と進捗/                   # Planning and progress folder
    ├── issue.001.md             # Main project specification
    └── 計画と進捗.md             # Progress tracking
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
2. `計画と進捗/計画と進捗.md` - Current progress tracking with detailed statistics
3. `レビュー結果_001.md` - Review results and improvement recommendations
4. `MarkDown/目次.md` - Current table of contents and chapter structure
5. `参考資料/AIによるまとめ/*.md` - AI-generated summaries of programming concepts
6. `参考資料/元資料/プログラミングのコツ.txt` - Programming tips and principles
7. `参考資料/元資料/*.pptx` - Original presentation materials (cannot be edited directly)

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
2. **Review Current Progress**: Check `計画と進捗/計画と進捗.md` for current status
3. **Create/Update Outline**: Work with detailed table of contents in `MarkDown/目次.md`
4. **Write Draft**: Create chapter-by-chapter drafts in `MarkDown/` folder
5. **Review and Revise**: Use review process documented in `レビュー結果_001.md`
6. **Update Documentation**: Keep README.md and progress files current

### File Organization
- Store finished markdown files in `MarkDown/` folder (already exists with 5 completed chapters)
- Update README.md to reflect current progress and status
- Update `計画と進捗/計画と進捗.md` with progress tracking
- Reference source materials appropriately when creating content
- Follow the review process documented in `レビュー結果_001.md`

## Common Tasks

### View Project Status
```bash
# Check git status
git status

# View recent changes
git log --oneline -5

# See all files in reference materials
ls -la 参考資料/*/

# Check current book progress
cat 計画と進捗/計画と進捗.md

# View table of contents
cat MarkDown/目次.md

# Check completed chapters
ls -la MarkDown/第*.md
```

### Create Book Content Structure
```bash
# MarkDown folder already exists with content - check current structure
ls -la MarkDown/

# Create new chapter files (example)
touch MarkDown/第6章_テスト駆動開発とTestable設計.md

# Create appendix files (example)
mkdir -p MarkDown/appendix
touch MarkDown/appendix/付録A_美しいソースコードのための七箇条.md
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
- Follow the review process established in `レビュー結果_001.md`
- Check for completeness against `参考資料` content as documented in reviews
- Verify no duplication between chapters as noted in quality assessments

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
- `.m4a`, `.mp4` - Audio/video files from AI tools (reference materials)
- `.png` - Image files (mind maps, diagrams)

### Files You Won't Find
- No `.cs`, `.java`, `.py`, `.js` source code files
- No `package.json`, `.csproj`, `Makefile` build files
- No test files or test frameworks
- No CI/CD workflows or deployment scripts

## Current Project Status

### Progress Summary
- **Completion Status**: 5 chapters completed (50% of main content)
- **Total Content**: 148,900+ characters across completed chapters
- **Target**: 300+ pages (estimated 300,000 characters total)
- **Review Process**: Established with documented feedback in `レビュー結果_001.md`

### Completed Chapters
1. **第1章**: 美しいソースコードの基本原則 (17,800文字)
2. **第2章**: 命名の重要性とベストプラクティス (15,800文字)  
3. **第3章**: モデリングとしてのプログラミング (29,400文字)
4. **第4章**: マルチパラダイムプログラミング (36,500文字)
5. **第5章**: オブジェクト指向設計の真髄 (49,400文字)

### Remaining Work
- Chapters 6-10 (テスト駆動開発, リファクタリング, etc.)
- Appendices A-E (七箇条詳細版, 命名規則, etc.)
- Final review and quality improvements based on review feedback


## Getting Started Checklist

When working in this repository:
1. Read this instruction file completely
2. Review `計画と進捗/issue.001.md` for project requirements
3. Check `計画と進捗/計画と進捗.md` for current progress and statistics
4. Review `レビュー結果_001.md` for quality feedback and improvement areas
5. Explore reference materials in `参考資料/AIによるまとめ/`
6. Check existing content in `MarkDown/` folder to understand current state
7. Focus on documentation tasks, not code development

**Remember: This is a documentation project. Do not waste time looking for build processes, tests, or applications that do not exist.**