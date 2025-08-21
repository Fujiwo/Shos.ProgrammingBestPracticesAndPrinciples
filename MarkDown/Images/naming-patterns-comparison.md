# 命名パターンとアンチパターンの比較

## 基本的な命名パターン

### 変数・フィールド命名

| パターン | 良い例 | 悪い例 | 理由 |
|----------|--------|--------|------|
| **意図を表現** | `customerCount` | `count` | 何をカウントするかが明確 |
| **型情報を避ける** | `customers` | `customerList` | 実装詳細ではなく概念を表現 |
| **略語を避ける** | `calculatedTotal` | `calcTot` | 完全な単語で意図を明確に |
| **否定形を避ける** | `isValid` | `isNotInvalid` | 肯定的な表現で理解しやすく |
| **文脈を活用** | `name` (Customer内) | `customerName` (Customer内) | クラス内では冗長な修飾子不要 |

### メソッド命名

| パターン | 良い例 | 悪い例 | 理由 |
|----------|--------|--------|------|
| **動作を表現** | `calculateTotal()` | `getTotal()` | 計算を行うことが明確 |
| **副作用を明示** | `updateAndSave()` | `update()` | 複数の動作があることを明示 |
| **戻り値を示唆** | `findCustomer()` | `getCustomer()` | nullの可能性を示唆 |
| **質問形を活用** | `isEmpty()` | `checkEmpty()` | Boolean戻り値を自然に表現 |
| **一貫した動詞** | `create/update/delete` | `create/modify/remove` | 操作の一貫性を保つ |

### クラス命名

| パターン | 良い例 | 悪い例 | 理由 |
|----------|--------|--------|------|
| **責務を表現** | `CustomerValidator` | `CustomerManager` | 具体的な責務が明確 |
| **抽象度を統一** | `EmailNotificationService` | `EmailService` | 抽象度レベルを明確に |
| **役割を示す接尾辞** | `OrderRepository` | `OrderData` | データアクセスパターンを明示 |
| **ドメイン用語** | `ShoppingCart` | `ItemContainer` | ビジネスドメインの用語を使用 |
| **実装詳細を避ける** | `CustomerRepository` | `CustomerDatabase` | 実装手法ではなく役割を表現 |

## アンチパターンとその対策

### 典型的なアンチパターン

```
悪いパターン                    改善後
──────────────────────────────────────────────
Manager, Handler               具体的な責務名
data, info, obj               具体的な概念名
temp, tmp, work               一時的でも意図を表現
flag, flg                     状態を具体的に表現
process, handle               具体的な動作を表現
i, j, k (ループ以外)           意味のある名前
get/set (副作用あり)          実際の動作を表現
```

### 言語別命名規約

| 言語 | クラス | メソッド | 変数 | 定数 | 例 |
|------|--------|----------|------|------|-----|
| **C#** | PascalCase | PascalCase | camelCase | UPPER_SNAKE | `CustomerService`, `GetCustomer`, `customerName`, `MAX_RETRY_COUNT` |
| **Java** | PascalCase | camelCase | camelCase | UPPER_SNAKE | `CustomerService`, `getCustomer`, `customerName`, `MAX_RETRY_COUNT` |
| **Python** | PascalCase | snake_case | snake_case | UPPER_SNAKE | `CustomerService`, `get_customer`, `customer_name`, `MAX_RETRY_COUNT` |
| **JavaScript** | PascalCase | camelCase | camelCase | UPPER_SNAKE | `CustomerService`, `getCustomer`, `customerName`, `MAX_RETRY_COUNT` |

## 文脈に応じた命名戦略

### レイヤー別命名パターン

```
プレゼンテーション層
├─ Controller: CustomerController, OrderController
├─ ViewModel: CustomerViewModel, OrderSummaryViewModel
└─ View: CustomerListView, OrderDetailView

ビジネス層
├─ Service: CustomerService, OrderProcessingService
├─ Domain: Customer, Order, Product
└─ Policy: PricingPolicy, DiscountPolicy

データアクセス層
├─ Repository: CustomerRepository, OrderRepository
├─ DAO: CustomerDao, OrderDao
└─ Entity: CustomerEntity, OrderEntity
```

### 設計パターン別命名

| パターン | 命名例 | 説明 |
|----------|--------|------|
| **Factory** | `CustomerFactory`, `OrderFactory` | オブジェクト生成の責務 |
| **Builder** | `CustomerBuilder`, `QueryBuilder` | 段階的なオブジェクト構築 |
| **Strategy** | `PricingStrategy`, `SortingStrategy` | アルゴリズムの切り替え |
| **Observer** | `OrderObserver`, `CustomerObserver` | 状態変化の監視 |
| **Decorator** | `LoggingDecorator`, `CachingDecorator` | 機能の装飾・拡張 |

## 命名の品質評価チェックリスト

### 自己評価項目

| 評価観点 | チェック項目 | ⭕ | ❌ |
|----------|-------------|---|---|
| **明確性** | 名前だけで役割が理解できるか | `UserValidator` | `UserChecker` |
| **一意性** | システム内で概念が重複していないか | `EmailSender` vs `NotificationService` | `EmailSender` vs `EmailService` |
| **一貫性** | 同様の概念に同様の命名ルールが適用されているか | `create/update/delete` | `create/modify/remove` |
| **簡潔性** | 必要十分な長さか | `calculateOrderTotal` | `calculateTheOrderTotalAmount` |
| **発音可能性** | 声に出して読めるか | `customerInfo` | `custInfo` |
| **検索可能性** | IDEで検索しやすいか | `CustomerValidator` | `Validator` |

### チーム評価項目

- [ ] ドメインエキスパートが理解できる用語を使用している
- [ ] 新しいチームメンバーが名前から役割を推測できる
- [ ] コードレビューで名前について質問が出ない
- [ ] ドキュメントを読まずにAPIの使い方が分かる
- [ ] ユニットテストの名前が自然に決まる