<!-- 図2.2: Name and Conquer フローチャート（日本語ラベル、色、注釈つき） -->

```mermaid
flowchart TD
  A[混沌した要求 / 現状]:::step --> B[概念抽出\n(重要な用語・概念を洗い出す)]:::step
  B --> C[候補に名前を付ける\n(ドメイン語彙を定義する)]:::step
  C --> D[境界を決める\n(責務と範囲を明確化)]:::step
  D --> E[実装へ反映\n(クラス・メソッドに落とす)]:::step
  E --> F[レビュー・評価\n(可読性・一貫性をチェック)]:::step
  F --> G{改善が必要か\n(テスト/レビューの結果)}:::decision
  G -- はい --> B
  G -- いいえ --> H[語彙に統合 / ドキュメント化]:::step

  %% 説明ノートを右側に配置
  subgraph NOTE[注釈]
    direction TB
    N1[注1: 名前は境界を示す]:::note
    N2[注2: 利用者視点で命名することを優先]:::note
  end

  classDef step fill:#e8f4ff,stroke:#2b6fb3,stroke-width:1px,color:#000
  classDef decision fill:#fff2cc,stroke:#b38600,stroke-width:1px,color:#000
  classDef note fill:#f0f0f0,stroke:#999,stroke-width:1px,color:#000

  linkStyle default stroke:#666,stroke-width:1px

  %% キャプションは図の直下に記述
```

<!-- キャプション: 図2.2 Name and Conquer — 概念を見つけて命名し、境界を定める反復プロセス。alt: フローチャートで示す命名の反復手順 -->
