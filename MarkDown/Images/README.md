# Images Directory

このディレクトリには、「Programming Best Practices and Principles」書籍で使用される図表、チャート、ダイアグラム、バナー画像が格納されています。

## ファイル形式

図表は主にMarkdown形式（.md）で作成されており、ASCII artや表を使用して視覚的な表現を提供しています。
章のバナー画像はSVG形式（.svg）で作成されており、スケーラブルで高品質な視覚表現を提供しています。

## 格納ファイル

### 章バナー画像
- `chapter-00-banner.svg` - 第0章「はじめに」のバナー画像（コードと物語のコミュニケーション）
- `chapter-01-banner.svg` - 第1章「美しいソースコードの基本原則」のバナー画像（七箇条と美の原則）
- `chapter-02-banner.svg` - 第2章「命名の重要性とベストプラクティス」のバナー画像（語彙と辞書）
- `chapter-03-banner.svg` - 第3章「モデリングとしてのプログラミング」のバナー画像（設計図とモデリング）
- `chapter-04-banner.svg` - 第4章「マルチパラダイムプログラミング」のバナー画像（複数のアプローチ）
- `chapter-05-banner.svg` - 第5章「オブジェクト指向設計の真髄」のバナー画像（オブジェクトとSOLID原則）
- `chapter-06-banner.svg` - 第6章「テスト駆動開発とTestable設計」のバナー画像（TDDサイクルとテストピラミッド）
- `chapter-07-banner.svg` - 第7章「リファクタリングと継続的品質改善」のバナー画像（改善と改良）
- `chapter-08-banner.svg` - 第8章「実践的なコーディング手法」のバナー画像（職人の道具と技法）
- `chapter-09-banner.svg` - 第9章「チーム開発における品質管理」のバナー画像（チームワークと協力）
- `chapter-10-banner.svg` - 第10章「現代的なプログラミング技術と将来展望」のバナー画像（技術進化と未来）
- `chapter-11-banner.svg` - 第11章「終わりに」のバナー画像（学習の旅路と達成）

### 概念図・ダイアグラム
- `seven-principles-overview.md` - 美しいソースコードのための七箇条の概要図
- `solid-principles-diagram.md` - SOLID原則の詳細構造図 
- `tdd-cycle-flowchart.md` - テスト駆動開発（TDD）のサイクル図
- `refactoring-workflow.md` - リファクタリングのワークフロー図
- `architecture-patterns-diagram.md` - アーキテクチャパターンと実践的設計
- `team-development-workflow.md` - チーム開発における品質管理ワークフロー
- `modeling-programming-concepts.md` - モデリングとしてのプログラミング概念図

### 比較表・チェックリスト
- `programming-paradigms-comparison.md` - プログラミングパラダイムの比較表
- `coding-standards-checklist.md` - コーディング規約とチェックリスト集

## 使用方法

各MarkDownファイルから以下のように参照してください：

```markdown
![図表の説明](Images/ファイル名.md)
![バナー画像の説明](Images/chapter-xx-banner.svg)
```

## 注意事項

- 図表ファイルはすべてUTF-8エンコーディングで作成されています
- ASCII artは等幅フォントでの表示を前提としています
- 表は標準的なMarkdown記法を使用しています
- SVGバナー画像はスケーラブルで、様々なサイズでの表示に対応しています