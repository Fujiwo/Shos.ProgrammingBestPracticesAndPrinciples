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
- Review and make minor improvements to completed content
- Update documentation and references
- Work with visual materials in the `MarkDown/Images/` directory
- Perform quality assurance and consistency checks

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
├── レビュー結果_002.md           # Second review iteration
├── レビュー結果_003.md           # Final review results  
├── MarkDown/                     # Book content (ALL content completed)
│   ├── 目次.md                   # Table of contents
│   ├── 表紙.md                   # Cover page
│   ├── 第0章 はじめに.md         # Introduction chapter
│   ├── 第1章_美しいソースコードの基本原則.md
│   ├── 第2章_命名の重要性とベストプラクティス.md
│   ├── 第3章_モデリングとしてのプログラミング.md
│   ├── 第4章_マルチパラダイムプログラミング.md
│   ├── 第5章_オブジェクト指向設計の真髄.md
│   ├── 第6章_テスト駆動開発とTestable設計.md
│   ├── 第7章_リファクタリングと継続的品質改善.md
│   ├── 第8章_実践的なコーディング手法.md
│   ├── 第9章_チーム開発における品質管理.md
│   ├── 第10章_現代的なプログラミング技術と将来展望.md
│   ├── 第11章_終わりに.md
│   ├── 付録A_美しいソースコードのための七箇条（詳細版）.md
│   ├── 付録B_命名規則とコーディング規約例.md
│   ├── 付録C_リファクタリングパターン集.md
│   ├── 付録D_新人プログラマーのためのコーディングの心得Q&A.md
│   ├── 付録E_参考文献と出典.md
│   ├── 付録F_用語集.md
│   └── Images/                   # Visual materials and diagrams
│       ├── README.md             # Images directory documentation
│       ├── *.svg                 # Chapter banners and diagrams
│       ├── *.md                  # Text-based diagrams and charts
│       └── *.png                 # Reference images
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
3. `レビュー結果_003.md` - Latest final review results and quality assessment
4. `レビュー結果_002.md` - Second review iteration results
5. `レビュー結果_001.md` - Initial review results and improvement recommendations
6. `MarkDown/目次.md` - Complete table of contents and chapter structure
7. `MarkDown/Images/README.md` - Visual materials and diagrams documentation
8. `参考資料/AIによるまとめ/*.md` - AI-generated summaries of programming concepts
9. `参考資料/元資料/プログラミングのコツ.txt` - Programming tips and principles
10. `参考資料/元資料/*.pptx` - Original presentation materials (cannot be edited directly)

### Understanding the Content
- The materials focus on "beautiful code" principles, object-oriented programming, and software quality
- Key concepts include "守破離" (Shu-Ha-Ri learning stages), modeling, and naming conventions
- Content emphasizes the "Why-What-How" development approach

## Working with a Completed Project

### Understanding the Current State
This project has reached completion status with all major content finished. The book contains:
- **12 main sections**: Introduction + 11 chapters covering comprehensive programming principles
- **6 appendices**: Detailed supplementary materials and references
- **Extensive visual materials**: Diagrams, charts, and banners in the Images/ directory
- **Complete documentation**: Multiple review cycles and progress tracking

### Types of Updates Appropriate for Completed Project
- **Minor editorial improvements**: Fixing typos, improving clarity
- **Documentation updates**: Keeping README.md and progress files current
- **Quality assurance**: Ensuring consistency across chapters
- **Reference updates**: Adding new sources or improving citations
- **Visual enhancements**: Improving diagrams or adding new visual aids
- **Format improvements**: Better organization of existing content

### Avoid Major Restructuring
Since the project is complete and has undergone multiple review cycles:
- Avoid major content reorganization without specific justification
- Don't delete substantial content unless it's clearly redundant or incorrect
- Maintain the established chapter structure and flow
- Preserve the review-approved content organization

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
- Store finished markdown files in `MarkDown/` folder (ALL 11 chapters + 6 appendices completed)
- All visual materials stored in `MarkDown/Images/` folder (extensive collection of diagrams and charts)
- Update README.md to reflect current progress and status
- Update `計画と進捗/計画と進捗.md` with progress tracking
- Reference source materials appropriately when creating content
- Follow the review process documented in multiple review files (レビュー結果_001-003.md)

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

# Check completed chapters and appendices
ls -la MarkDown/第*.md MarkDown/付録*.md

# Check visual materials
ls -la MarkDown/Images/

# Check all review results
ls -la レビュー結果_*.md
```

### Create Book Content Structure
```bash
# MarkDown folder contains complete content - check current structure
ls -la MarkDown/

# Check visual materials and diagrams
ls -la MarkDown/Images/

# All chapters and appendices are complete - check for updates
ls -la MarkDown/第*.md MarkDown/付録*.md
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
- Follow the review process established in multiple review files (レビュー結果_001-003.md)
- Check for completeness against `参考資料` content as documented in reviews
- Verify no duplication between chapters as noted in quality assessments
- Use visual materials from `MarkDown/Images/` directory appropriately

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
- `.png` - Image files (mind maps, diagrams, reference images)
- `.svg` - Scalable vector graphics (chapter banners, diagrams)
- `.jpg` - JPEG images (author photos, reference materials)

### Files You Won't Find
- No `.cs`, `.java`, `.py`, `.js` source code files
- No `package.json`, `.csproj`, `Makefile` build files
- No test files or test frameworks
- No CI/CD workflows or deployment scripts

## Current Project Status

### Progress Summary
- **Completion Status**: ALL 11 chapters + 6 appendices completed (100% complete)
- **Total Content**: 550,000+ characters across all completed content
- **Target**: 300+ pages (ACHIEVED - approximately 400 pages)
- **Review Process**: Completed with 3 comprehensive review cycles documented in レビュー結果_001-003.md

### Visual Materials and Images
The `MarkDown/Images/` directory contains extensive visual materials:
- **Chapter banners**: SVG banners for each chapter and appendix
- **Concept diagrams**: Seven principles overview, SOLID principles, TDD cycle
- **Workflow charts**: Refactoring workflow, team development processes
- **Comparison tables**: Programming paradigms, naming patterns, testing strategies
- **Technical diagrams**: Architecture patterns, technology evolution timeline
- **Code examples**: Before/after examples showing principle applications

### Completed Chapters
**All chapters and appendices are now complete:**

1. **第0章**: はじめに - なぜあなたのコードは6ヶ月後に読めなくなるのか?
2. **第1章**: 美しいソースコードの基本原則 - 七箇条と品質属性
3. **第2章**: 命名の重要性とベストプラクティス - Name and Conquer戦略  
4. **第3章**: モデリングとしてのプログラミング - 関心の分離と抽象化
5. **第4章**: マルチパラダイムプログラミング - 命令型vs宣言型
6. **第5章**: オブジェクト指向設計の真髄 - SOLID原則とカプセル化
7. **第6章**: テスト駆動開発とTestable設計 - TDD実践とF.I.R.S.T原則
8. **第7章**: リファクタリングと継続的品質改善 - コードの臭いと改善戦略
9. **第8章**: 実践的なコーディング手法 - Think Simple と意図表現
10. **第9章**: チーム開発における品質管理 - コードレビューとCI/CD
11. **第10章**: 現代的なプログラミング技術と将来展望 - C#進化とクラウド
12. **第11章**: 終わりに - 学習の道のりと継続的成長

**Appendices (付録):**
- **付録A**: 美しいソースコードのための七箇条（詳細版・実践ガイド）
- **付録B**: 多言語対応命名規則とコーディング規約例
- **付録C**: 実践的リファクタリングパターン集
- **付録D**: 新人プログラマーのためのコーディングの心得Q&A
- **付録E**: 包括的参考文献・出典一覧
- **付録F**: 技術用語集（日英対応）

### Remaining Work
**Project is now complete! Final activities:**
- [ ] Minor editorial improvements and polishing based on review feedback
- [ ] Final quality assurance and consistency checks
- [ ] Update documentation to reflect completion status


## Getting Started Checklist

When working in this repository:
1. Read this instruction file completely
2. Review `計画と進捗/issue.001.md` for project requirements
3. Check `計画と進捗/計画と進捗.md` for current progress and detailed statistics
4. Review `レビュー結果_003.md` for latest quality feedback and completion assessment
5. Review `レビュー結果_002.md` and `レビュー結果_001.md` for review history
6. Explore reference materials in `参考資料/AIによるまとめ/`
7. Check existing content in `MarkDown/` folder to understand the complete structure
8. Use visual materials from `MarkDown/Images/` directory appropriately
9. Focus on minor improvements and documentation updates (project is complete)

**Remember: This is a completed documentation project. The book is finished with all 11 chapters and 6 appendices. Focus on minor improvements, documentation updates, and quality assurance rather than major content creation.**