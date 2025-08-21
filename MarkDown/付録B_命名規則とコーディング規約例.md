# 付録B 命名規則とコーディング規約例

## B.1 基本的な命名規則

### B.1.1 C#命名規則

#### クラス・インターフェース・構造体
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

![コーディング規約チェックリスト集](Images/coding-standards-checklist.md)

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

この付録で示した命名規則とコーディング規約は、チーム開発において一貫性を保つための基盤となる。これらの規約を遵守することで、コードの可読性と保守性が大幅に向上し、開発効率の向上につながる。