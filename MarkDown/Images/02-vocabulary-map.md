<!-- 図2.3: 語彙マップ（Chapter 2: 命名） - Mermaid 図案（日本語ラベル、凡例つき） -->

```mermaid
flowchart TB
  %% メイン構造
  subgraph VOC[図2.3 語彙マップ — ドメイン語彙とコード要素の対応]
    direction TB
    V[語彙\n/Vocabulary]:::vocab
    DT[ドメイン用語\n(Domain Terms)]:::domain
    CL[型\n(Classes)]:::class
    MT[振る舞い\n(Methods)]:::method
    VB[変数・状態\n(Variables)]:::var
    SV[サービス\n(Services / API)]:::service
  end

  V --> DT
  V --> CL
  V --> MT
  V --> VB
  V --> SV

  %% ドメイン用語とコード要素の対応例
  DT -->|表現する| CL
  DT -->|表現する| MT

  CL -->|例| C1[Customer\n(顧客)]
  CL -->|例| C2[Order\n(注文)]
  MT -->|例| M1[PlaceOrder()\n(注文を出す)]
  MT -->|例| M2[CalculateTotal()\n(合計を計算)]
  VB -->|例| V1[pendingOrders\n(保留注文)]
  VB -->|例| V2[orderStatus\n(注文状態)]
  SV -->|例| S1[CustomerRepository\n(顧客リポジトリ)]
  SV -->|例| S2[EmailService\n(メール配信サービス)]

  C1 ---|使用| M1
  C2 ---|使用| M2
  S1 ---|返す| C1
  S2 ---|通知対象| C1

  %% 凡例とスタイル
  subgraph LEGEND[凡例]
    direction LR
    L1[ドメイン用語]:::domain
    L2[型/クラス]:::class
    L3[振る舞い/メソッド]:::method
    L4[変数/状態]:::var
    L5[サービス/API]:::service
  end

  classDef vocab fill:#fff2cc,stroke:#996515,stroke-width:1px,color:#000
  classDef domain fill:#ffd699,stroke:#b36b00,stroke-width:1px,color:#000
  classDef class fill:#d0f0c0,stroke:#2e8b57,stroke-width:1px,color:#000
  classDef method fill:#cfe2ff,stroke:#2255aa,stroke-width:1px,color:#000
  classDef var fill:#fff2b2,stroke:#a67c00,stroke-width:1px,color:#000
  classDef service fill:#f8d7da,stroke:#a71d2a,stroke-width:1px,color:#000

  linkStyle default stroke:#888,stroke-width:1px

  %% 注記: 図は本文で "図2.3 を参照" と言及すること
```

<!-- キャプション: 図2.3 語彙マップ — ドメイン語彙とコード要素の対応。alt: ドメイン用語とクラス/メソッド/変数/サービスの関係図 -->
