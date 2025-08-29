# 付録B 命名規則とコーディング規約例

![付録B バナー](Images/banner-appendix-b.svg)

## B.1 基本的な命名規則

### B.1.1 C#命名規則

#### クラス・インターフェース・構造体

_[C#]_
```csharp
// ✅ PascalCase を使用
public class CustomerService { }
public interface ICustomerRepository { }
public struct Point { }
public enum OrderStatus { }

// インターフェースには I プレフィックス
public interface IEmailService { }
public interface IDataRepository<T> { }

// 抽象クラスには Abstract プレフィックス(オプション)
public abstract class AbstractCustomerProcessor { }

// 例外クラスには Exception サフィックス
public class CustomerNotFoundException : Exception { }
```

#### メソッド・プロパティ

_[C#]_
```csharp
// ✅ PascalCase を使用
public void ProcessOrder() { }
public string CustomerName { get; set; }
public bool IsActive { get; set; }
public int TotalCount { get; private set; }

// ブール値のプロパティには Is/Has/Can を使用
public bool IsValid { get; }
public bool HasPermission { get; }
public bool CanProcess { get; }
```

#### フィールド・変数・パラメータ

_[C#]_
```csharp
// ✅ camelCase を使用
public void ProcessCustomer(string customerName, int orderId)
{
    var processedOrder = GetOrder(orderId);
    var customerInfo = GetCustomerInfo(customerName);
}

// プライベートフィールドにはアンダースコアプレフィックス
private readonly ICustomerRepository _customerRepository;
private string _connectionString;
private static readonly ILogger _logger = LogManager.GetCurrentClassLogger();
```

#### 定数・列挙値

_[C#]_
```csharp
// ✅ PascalCase を使用
public const int MaxRetryCount = 3;
public const string DefaultCurrency = "JPY";

public enum OrderStatus
{
    Pending,
    Processing,
    Completed,
    Cancelled
}
```

### B.1.2 Java命名規則

_[Java]_
```java
// クラス:PascalCase
public class CustomerService { }

// インターフェース:PascalCase(I プレフィックスなし)
public interface CustomerRepository { }

// メソッド・変数:camelCase
public void processOrder(String customerName, int orderId) {
    List<Order> processedOrders = getOrders(orderId);
    CustomerInfo customerInfo = getCustomerInfo(customerName);
}

// 定数:SCREAMING_SNAKE_CASE
public static final int MAX_RETRY_COUNT = 3;
public static final String DEFAULT_CURRENCY = "JPY";

// パッケージ:小文字、ドット区切り
package com.company.project.domain.customer;
```

### B.1.3 Python命名規則

_[Python]_
```python
# クラス:PascalCase
class CustomerService:
    pass

# 関数・変数:snake_case
def process_order(customer_name, order_id):
    processed_orders = get_orders(order_id)
    customer_info = get_customer_info(customer_name)
    return processed_orders

# 定数:SCREAMING_SNAKE_CASE
MAX_RETRY_COUNT = 3
DEFAULT_CURRENCY = "JPY"

# プライベート:アンダースコアプレフィックス
class CustomerService:
    def __init__(self):
        self._connection_string = ""
        self.__private_data = {}  # 強いプライベート
```

### B.1.4 JavaScript/TypeScript命名規則

_[JavaScript]_
```javascript
// クラス:PascalCase
class CustomerService { }

// 関数・変数:camelCase
function processOrder(customerName, orderId) {
    const processedOrders = getOrders(orderId);
    const customerInfo = getCustomerInfo(customerName);
    return processedOrders;
}

// 定数:SCREAMING_SNAKE_CASE または camelCase
const MAX_RETRY_COUNT = 3;
const defaultCurrency = "JPY";

// TypeScript インターフェース
interface CustomerRepository {
    findById(id: number): Promise<Customer>;
    save(customer: Customer): Promise<void>;
}
```

## B.2 ドメイン駆動な命名

### B.2.1 ビジネス概念の表現

_[C#]_
```csharp
// ❌ 技術的な名前
public class DataManager
{
    public void SaveData(object data) { }
    public object GetData(int id) { }
    public void ProcessData(object data) { }
}

// ✅ ビジネス概念に基づく名前
public class CustomerRepository
{
    public void SaveCustomer(Customer customer) { }
    public Customer FindCustomerById(CustomerId id) { }
}

public class OrderProcessor
{
    public void ProcessOrder(Order order) { }
    public void CancelOrder(OrderId orderId) { }
}
```

### B.2.2 ユビキタス言語の活用

_[C#]_
```csharp
// ECサイトドメインの例
public class ShoppingCart
{
    public void AddItem(Product product, int quantity) { }
    public void RemoveItem(ProductId productId) { }
    public void ApplyCoupon(CouponCode couponCode) { }
    public CheckoutResult Checkout(PaymentMethod paymentMethod) { }
}

public class InventoryManager
{
    public void ReserveStock(ProductId productId, int quantity) { }
    public void ReleaseReservation(ReservationId reservationId) { }
    public StockLevel CheckStockLevel(ProductId productId) { }
}

// 金融ドメインの例
public class Account
{
    public void Deposit(Money amount) { }
    public WithdrawalResult Withdraw(Money amount) { }
    public void Transfer(Money amount, Account destinationAccount) { }
    public Balance GetBalance() { }
}
```

### B.2.3 動詞の選択指針

#### 作成・生成系

_[C#]_
```csharp
// Create: 新しいエンティティの作成
public Customer CreateCustomer(CustomerRequest request) { }

// Generate: アルゴリズムやルールに基づく生成
public string GenerateOrderNumber() { }
public Password GenerateRandomPassword() { }

// Build: 複数の部品からの組み立て
public EmailMessage BuildWelcomeEmail(Customer customer) { }
public Report BuildMonthlyReport(DateTime month) { }

// Make: 簡単な変換や作成
public string MakeDisplayName(string firstName, string lastName) { }
```

#### 取得・検索系

_[C#]_
```csharp
// Get: 確実に存在するものの取得
public Customer GetCustomer(CustomerId id) { }

// Find: 存在しない可能性があるものの検索
public Customer FindCustomerByEmail(string email) { }

// Search: 条件に基づく検索
public List<Customer> SearchCustomers(CustomerSearchCriteria criteria) { }

// Retrieve: 外部システムからの取得
public CustomerData RetrieveCustomerFromExternalSystem(string externalId) { }

// Fetch: データベースやAPIからの取得
public List<Order> FetchRecentOrders(CustomerId customerId, int count) { }
```

#### 処理・実行系

_[C#]_
```csharp
// Process: 複雑な業務処理
public void ProcessPayment(Payment payment) { }

// Execute: コマンドやタスクの実行
public void ExecuteWorkflow(WorkflowDefinition workflow) { }

// Perform: 特定のアクションの実行
public void PerformHealthCheck() { }

// Handle: イベントや例外の処理
public void HandleOrderCancellation(OrderCancelledEvent @event) { }
```

#### 検証・確認系

_[C#]_
```csharp
// Validate: 包括的な検証
public ValidationResult ValidateOrder(Order order) { }

// Check: 単純な確認
public bool CheckStockAvailability(ProductId productId, int quantity) { }

// Verify: 正確性の確認
public bool VerifyPaymentMethod(PaymentMethod paymentMethod) { }

// Ensure: 条件の保証
public void EnsureCustomerExists(CustomerId customerId) { }
```

## B.3 コーディング規約例

### B.3.1 C#コーディング規約

#### ファイル構成

_[C#]_
```csharp
// ✅ 推奨されるファイル構成
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyProject.Domain.Entities;
using MyProject.Domain.Services;

namespace MyProject.Application.Services
{
    /// <summary>
    /// 顧客管理サービス
    /// </summary>
    public class CustomerService : ICustomerService
    {
        #region フィールド
        private readonly ICustomerRepository _customerRepository;
        private readonly IEmailService _emailService;
        private readonly ILogger<CustomerService> _logger;
        #endregion

        #region コンストラクタ
        public CustomerService(
            ICustomerRepository customerRepository,
            IEmailService emailService,
            ILogger<CustomerService> logger)
        {
            _customerRepository = customerRepository ?? throw new ArgumentNullException(nameof(customerRepository));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        #endregion

        #region パブリックメソッド
        public async Task<Customer> RegisterCustomerAsync(CustomerRegistrationRequest request)
        {
            ValidateRegistrationRequest(request);

            var customer = CreateCustomerFromRequest(request);
            var savedCustomer = await _customerRepository.SaveAsync(customer);

            await SendWelcomeEmailAsync(savedCustomer);

            _logger.LogInformation("顧客が正常に登録されました: {CustomerId}", savedCustomer.Id);

            return savedCustomer;
        }
        #endregion

        #region プライベートメソッド
        private void ValidateRegistrationRequest(CustomerRegistrationRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            if (string.IsNullOrEmpty(request.Email))
                throw new ArgumentException("メールアドレスは必須です", nameof(request));
        }

        private Customer CreateCustomerFromRequest(CustomerRegistrationRequest request)
        {
            return new Customer
            {
                Name = request.Name,
                Email = request.Email,
                RegistrationDate = DateTime.UtcNow,
                Status = CustomerStatus.Active
            };
        }

        private async Task SendWelcomeEmailAsync(Customer customer)
        {
            try
            {
                await _emailService.SendWelcomeEmailAsync(customer.Email, customer.Name);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "ウェルカムメールの送信に失敗しました: {CustomerId}", customer.Id);
                // メール送信失敗は業務処理を停止しない
            }
        }
        #endregion
    }
}
```

#### インデントとブレース

_[C#]_
```csharp
// ✅ 推奨スタイル
public class CustomerService
{
    public void ProcessOrder(Order order)
    {
        if (order == null)
        {
            throw new ArgumentNullException(nameof(order));
        }

        if (order.Items.Any())
        {
            foreach (var item in order.Items)
            {
                ProcessOrderItem(item);
            }
        }
        else
        {
            _logger.LogWarning("注文に商品が含まれていません: {OrderId}", order.Id);
        }
    }
}
```

#### 空白とスペース

_[C#]_
```csharp
// ✅ 推奨スタイル
public class Calculator
{
    public decimal Calculate(decimal amount, decimal taxRate)
    {
        var taxAmount = amount * taxRate;
        var total = amount + taxAmount;

        return Math.Round(total, 2);
    }

    public bool IsValidRange(int value, int min, int max)
    {
        return value >= min && value <= max;
    }
}
```

### B.3.2 メソッド設計規約

#### メソッドサイズ

_[C#]_
```csharp
// ✅ 適切なサイズ(10行以内が理想)
public ValidationResult ValidateEmail(string email)
{
    if (string.IsNullOrEmpty(email))
        return ValidationResult.Failure("メールアドレスが入力されていません");

    if (!email.Contains("@"))
        return ValidationResult.Failure("有効なメールアドレスを入力してください");

    if (email.Length > 254)
        return ValidationResult.Failure("メールアドレスが長すぎます");

    return ValidationResult.Success();
}
```

#### パラメータ数の制限

_[C#]_
```csharp
// ❌ パラメータが多すぎる
public void CreateCustomer(string name, string email, string phone, string address,
    string city, string state, string zipCode, DateTime birthDate, string notes)
{
    // 処理...
}

// ✅ オブジェクトでまとめる
public void CreateCustomer(CustomerCreationRequest request)
{
    // 処理...
}

public class CustomerCreationRequest
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public Address Address { get; set; }
    public DateTime BirthDate { get; set; }
    public string Notes { get; set; }
}
```

### B.3.3 例外処理規約

#### 例外の種類と使い分け

_[C#]_
```csharp
// ✅ 適切な例外の使い分け
public class CustomerService
{
    public Customer GetCustomer(CustomerId id)
    {
        // 引数チェック
        if (id == null)
            throw new ArgumentNullException(nameof(id));

        if (id.IsEmpty)
            throw new ArgumentException("顧客IDが無効です", nameof(id));

        // ビジネスルールチェック
        var customer = _repository.FindById(id);
        if (customer == null)
            throw new CustomerNotFoundException($"顧客が見つかりません: {id}");

        // 認可チェック
        if (!_authorizationService.CanAccessCustomer(customer))
            throw new UnauthorizedAccessException("この顧客にアクセスする権限がありません");

        return customer;
    }
}

// カスタム例外の定義
public class CustomerNotFoundException : Exception
{
    public CustomerNotFoundException(string message) : base(message) { }
    public CustomerNotFoundException(string message, Exception innerException)
        : base(message, innerException) { }
}
```

### B.3.4 非同期処理規約

_[C#]_
```csharp
// ✅ 非同期メソッドの命名とシグネチャ
public class CustomerService
{
    // 非同期メソッドには Async サフィックス
    public async Task<Customer> GetCustomerAsync(CustomerId id)
    {
        return await _repository.GetByIdAsync(id);
    }

    // CancellationToken の受け渡し
    public async Task<List<Customer>> SearchCustomersAsync(
        CustomerSearchCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        return await _repository.SearchAsync(criteria, cancellationToken);
    }

    // ConfigureAwait(false) の使用
    public async Task ProcessCustomerAsync(Customer customer)
    {
        await _repository.SaveAsync(customer).ConfigureAwait(false);
        await _emailService.SendNotificationAsync(customer).ConfigureAwait(false);
    }
}
```

## B.4 コード品質チェックリスト

美しいソースコードを書くためのチェックリストを以下に示す。これらは日常的な開発やコードレビューで活用できる。

### コーディング規約チェックリスト集

#### 命名規則チェックリスト

##### クラス・インターフェース命名

| チェック項目 | 良い例 | 悪い例 | 説明 |
|-------------|--------|--------|------|
| **名詞または名詞句** | `CustomerService` | `ProcessCustomer` | クラスは物や概念を表す |
| **PascalCase** | `OrderManager` | `orderManager` | 各単語の先頭を大文字 |
| **意図を表現** | `EmailValidator` | `Validator` | 具体的な責務を示す |
| **省略語を避ける** | `CustomerRepository` | `CustRepo` | 完全な単語を使用 |
| **Interfaceプレフィックス** | `IPaymentService` | `PaymentServiceInterface` | I + 実装クラス名 |

##### メソッド命名

| チェック項目 | 良い例 | 悪い例 | 説明 |
|-------------|--------|--------|------|
| **動詞で開始** | `CalculateTotal()` | `Total()` | 何をするかを明確に |
| **camelCase** | `validateEmail()` | `ValidateEmail()` | 最初の文字は小文字 |
| **ブール値返却** | `IsValid()`, `CanProcess()` | `Valid()`, `Process()` | Is/Can/Has で開始 |
| **副作用を示す** | `SaveAndNotify()` | `Save()` | 複数の処理を明示 |
| **引数を説明** | `FindByEmail(string)` | `Find(string)` | 検索条件を明示 |

##### 変数命名

| チェック項目 | 良い例 | 悪い例 | 説明 |
|-------------|--------|--------|------|
| **意味のある名前** | `customerCount` | `count` | 何をカウントするか明示 |
| **型情報を避ける** | `customers` | `customerList` | 型は別途宣言 |
| **短すぎる名前を避ける** | `index` | `i` | ループ以外では避ける |
| **否定形を避ける** | `isEnabled` | `isNotDisabled` | 肯定形で表現 |
| **一時変数の明確化** | `tempTotal` | `temp` | 一時的でも役割を示す |

#### コード構造チェックリスト

##### メソッド設計

| チェック項目 | 基準 | チェック方法 | 改善方法 |
|-------------|------|-------------|----------|
| **長さ** | 20行以内 | 行数カウント | メソッド分割 |
| **引数の数** | 3個以内 | パラメータ数確認 | パラメータオブジェクト導入 |
| **ネストレベル** | 3レベル以内 | インデント確認 | Early Return パターン |
| **単一責務** | 一つの機能のみ | 処理内容確認 | 責務分離 |
| **副作用** | 最小限 | 変更箇所確認 | 純粋関数化 |

##### クラス設計

| チェック項目 | 基準 | チェック方法 | 改善方法 |
|-------------|------|-------------|----------|
| **クラスサイズ** | 200行以内 | 行数カウント | クラス分割 |
| **メソッド数** | 10個以内 | メソッド数確認 | 責務分離 |
| **依存関係** | 最小限 | using文確認 | 依存関係整理 |
| **凝集度** | 高い | メンバー関連性確認 | 関連機能のグループ化 |
| **結合度** | 低い | 他クラス参照確認 | インターフェース導入 |

#### エラーハンドリングチェックリスト

##### 例外処理

| チェック項目 | 良い例 | 悪い例 | 説明 |
|-------------|--------|--------|------|
| **適切な例外型** | `ArgumentNullException` | `Exception` | 具体的な例外型を使用 |
| **意味のあるメッセージ** | `"Email address is required"` | `"Error"` | 問題を具体的に説明 |
| **リソース解放** | `using` statement | `try-finally` | 確実なリソース管理 |
| **例外の再スロー** | `throw;` | `throw ex;` | スタックトレース保持 |
| **ログ出力** | 適切なレベルで記録 | 例外を無視 | 問題の追跡可能性 |

##### 防御的プログラミング

| チェック項目 | 実装例 | 効果 |
|-------------|--------|------|
| **null チェック** | `if (value == null) throw new ArgumentNullException(nameof(value));` | NullReferenceException防止 |
| **引数検証** | `if (count < 0) throw new ArgumentOutOfRangeException(nameof(count));` | 不正値の早期検出 |
| **事前条件** | `Contract.Requires(items.Any());` | 前提条件の明確化 |
| **事後条件** | `Contract.Ensures(result != null);` | 結果の保証 |
| **不変条件** | `Contract.Invariant(count >= 0);` | オブジェクト状態の保証 |

#### パフォーマンスチェックリスト

##### 一般的なパフォーマンス

| チェック項目 | 問題のあるコード | 改善されたコード | 効果 |
|-------------|------------------|------------------|------|
| **文字列連結** | `str += item;` | `StringBuilder.Append(item);` | メモリ効率向上 |
| **コレクション初期化** | `new List<T>()` | `new List<T>(capacity)` | 再割り当て回避 |
| **LINQ vs ループ** | 複雑なLINQ | `foreach` | 可読性とパフォーマンス |
| **非同期処理** | `Task.Result` | `await task` | デッドロック回避 |
| **リソース管理** | 手動Close | `using` | 確実な解放 |

##### データベースアクセス

| チェック項目 | 問題点 | 改善方法 | 効果 |
|-------------|--------|----------|------|
| **N+1問題** | ループ内でクエリ実行 | Eager Loading, Join | クエリ数削減 |
| **SELECT *** | 全カラム取得 | 必要カラムのみ指定 | 転送量削減 |
| **接続プール** | 接続の使い回し未実装 | Connection Pooling | 接続コスト削減 |
| **インデックス** | インデックス未設定 | 適切なインデックス作成 | 検索性能向上 |
| **トランザクション** | 長時間トランザクション | 適切な範囲設定 | ロック時間短縮 |

#### セキュリティチェックリスト

##### 入力検証

| チェック項目 | 脆弱性 | 対策 | 実装例 |
|-------------|--------|------|--------|
| **SQLインジェクション** | 動的SQL生成 | パラメータ化クエリ | `SELECT * FROM Users WHERE Id = @id` |
| **XSS** | 未エスケープ出力 | HTMLエンコード | `HttpUtility.HtmlEncode(input)` |
| **CSRF** | トークン未検証 | CSRFトークン | `@Html.AntiForgeryToken()` |
| **パストラバーサル** | ファイルパス未検証 | パス正規化 | `Path.GetFullPath(path)` |
| **入力値検証** | 検証なし | 厳密な検証 | データアノテーション |

##### 認証・認可

| チェック項目 | リスク | 対策 | 備考 |
|-------------|--------|------|------|
| **パスワード保存** | 平文保存 | ハッシュ化+ソルト | bcrypt, PBKDF2使用 |
| **セッション管理** | 固定セッションID | セッション再生成 | ログイン時に更新 |
| **権限チェック** | 権限未確認 | 適切な認可 | Role-based Access Control |
| **機密情報** | ログ出力 | マスキング | 個人情報の保護 |
| **通信暗号化** | 平文通信 | HTTPS/TLS | 盗聴防止 |

#### 保守性チェックリスト

##### コメント・ドキュメント

| チェック項目 | 良い例 | 悪い例 | ガイドライン |
|-------------|--------|--------|-------------|
| **XML文書コメント** | `/// <summary>顧客情報を検証する</summary>` | `// 検証` | API仕様を明確に |
| **複雑な処理の説明** | アルゴリズムの解説 | 自明な処理の説明 | 「なぜ」を説明 |
| **TODOコメント** | `// TODO: 例外処理の追加 (Issue #123)` | `// TODO: 修正` | 追跡可能な形式 |
| **廃止予定API** | `[Obsolete("Use NewMethod instead")]` | コメントのみ | 適切な属性使用 |
| **設計意図** | パターンや制約の説明 | 実装詳細 | 設計判断の記録 |

##### テスタビリティ

| チェック項目 | 設計 | 利点 | 実装方法 |
|-------------|------|------|----------|
| **依存性注入** | インターフェースを使用 | モック化可能 | DIコンテナ活用 |
| **純粋関数** | 副作用なし | 予測可能 | 関数型アプローチ |
| **静的依存の回避** | インスタンス化 | テスト分離 | ファクトリパターン |
| **時間の抽象化** | IDateTimeProvider | 時間制御可能 | システム時計の注入 |
| **外部リソース** | インターフェース化 | モック化 | Repository パターン |

### B.4.1 命名チェックリスト

#### クラス・メソッド名
- [ ] 名前から機能が想像できるか?
- [ ] 省略語を避けているか?
- [ ] 一貫した動詞を使用しているか?
- [ ] ビジネス概念を反映しているか?

#### 変数名
- [ ] 役割が明確か?
- [ ] スコープに適した長さか?
- [ ] 型情報を名前に含めていないか?
- [ ] 否定形を避けているか?

#### ブール値
- [ ] Is/Has/Can で始まっているか?
- [ ] 肯定形で表現されているか?
- [ ] 意味が明確か?

### B.4.2 コード構造チェックリスト

#### メソッド設計
- [ ] 単一責務を守っているか?
- [ ] 適切なサイズか(15行以内)?
- [ ] パラメータ数は適切か(3個以内が理想)?
- [ ] 戻り値の型は適切か?

#### クラス設計
- [ ] 凝集度が高いか?
- [ ] 結合度が低いか?
- [ ] 依存関係が明確か?
- [ ] テストしやすい構造か?

#### エラーハンドリング
- [ ] 適切な例外型を使用しているか?
- [ ] メッセージが分かりやすいか?
- [ ] ログ出力は適切か?
- [ ] リソースの解放は適切か?

### B.4.3 パフォーマンスチェックリスト

#### 非同期処理
- [ ] I/O操作で async/await を使用しているか?
- [ ] CancellationToken を適切に使用しているか?
- [ ] ConfigureAwait(false) を適切に使用しているか?
- [ ] デッドロックの可能性はないか?

#### メモリ使用
- [ ] 不要なオブジェクト生成を避けているか?
- [ ] IDisposable の実装は適切か?
- [ ] using文を適切に使用しているか?
- [ ] メモリリークの可能性はないか?

## 参考

- [C# コーディング ガイドライン (2025年度版)](https://github.com/Fujiwo/CSharpCodingGuideline/blob/main/README.Japanese.md) https://github.com/Fujiwo/CSharpCodingGuideline/blob/main/README.Japanese.md (日本語版)
- [C# Coding Guidelines (2025 Edition)](https://github.com/Fujiwo/CSharpCodingGuideline/blob/main/README.English.md) https://github.com/Fujiwo/CSharpCodingGuideline/blob/main/README.English.md  (英語版)

この付録で示した命名規則とコーディング規約は、チーム開発において一貫性を保つための基盤となる。これらの規約を遵守することで、コードの可読性と保守性が大幅に向上し、開発効率の向上につながる。

---

**[← 目次に戻る](table-of-contents.md)**
