# Service Oriented Naming (SON) 概念図

```mermaid
graph TD
    A[クライアント] --> B[サービス指向名前付け<br/>SON]
    B --> C[サービス提供者]
   
    D[実装者視点<br/>❌ 悪い例] --> E[SqlCustomerDAO<br/>ExecuteSqlQuery<br/>技術的詳細が露出]
   
    F[クライアント視点<br/>✅ 良い例] --> G[CustomerRepository<br/>FindById<br/>ビジネス概念で表現]
   
    H[命名の原則] --> I[What: 何をするか]
    H --> J[Who: 誰のためか]
    H --> K[Why: なぜ必要か]
   
    I --> L[顧客を検索する]
    J --> M[クライアント開発者]
    K --> N[ビジネス要求実現]
   
    style A fill:#e1f5fe
    style C fill:#e1f5fe
    style D fill:#ffebee
    style F fill:#e8f5e8
    style E fill:#ffcdd2
    style G fill:#c8e6c9
```

## SON (Service Oriented Naming) の核心原則

### 1. クライアント視点での命名
- **実装詳細ではなく、サービスの本質を表現**
- **技術的詳細よりも、ビジネス価値を重視**

### 2. サービス提供の観点
| 観点 | 悪い例 | 良い例 |
|------|--------|--------|
| **技術観点** | `SqlDataAccess` | `CustomerRepository` |
| **処理観点** | `ExecuteQuery` | `FindCustomer` |
| **実装観点** | `HttpPostRequest` | `SubmitOrder` |

### 3. 命名判断フロー
```
1. このコードの「クライアント」は誰か？
2. クライアントは何を「求めている」か？
3. どのような「サービス」を提供するか？
4. そのサービスを一言で表現すると？
5. その表現がクラス/メソッド名として適切か？
```

### 4. SON適用の効果
- **理解容易性**: クライアントが意図を直感的に理解
- **保守性**: 実装変更がクライアントに影響しない
- **再利用性**: 明確な責務により再利用しやすい
- **テスト性**: 明確なサービス境界によりテストしやすい

---

*この図は第2章「命名の重要性とベストプラクティス」の理解を促進するために作成されました。*