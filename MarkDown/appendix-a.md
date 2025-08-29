# 付録A 美しいソースコードのための七箇条

![付録A バナー](Images/banner-appendix-a.svg)

## A.1 第一箇条:意図を表現

### A.1.1 意図表現の本質

「意図を表現」とは、ソースコードが**「何をやりたいか」**という目的を明確に示し、かつその意図以外の不要な記述(ノイズ)が少ない状態を指す。これは美しいソースコードの最も重要な原則である。

#### 良い例:意図が明確なコード

_[C#]_
```csharp
// ✅ 意図が明確
public List<Customer> GetActiveCustomers()
{
    return customers.Where(customer => customer.IsActive).ToList();
}

public decimal CalculateMonthlyRevenue(DateTime month)
{
    return orders
        .Where(order => order.Date.Month == month.Month && order.Date.Year == month.Year)
        .Sum(order => order.TotalAmount);
}
```

#### 悪い例:意図が不明確なコード

_[C#]_
```csharp
// ❌ 意図が不明確
public List<Customer> GetData()
{
    var result = new List<Customer>();
    for (int i = 0; i < customers.Count; i++)
    {
        if (customers[i].Status == 1)
        {
            result.Add(customers[i]);
        }
    }
    return result;
}
```

### A.1.2 ノイズの最小化

**ノイズ**とは、コードの意図とは直接関係のない、実装の詳細や構文上の記述を指す。

#### ノイズの例

_[C#]_
```csharp
// ❌ ノイズが多い
for (int i = 0; i < customerList.Count; i++)
{
    Customer customer = customerList[i];
    if (customer.GetOrderCount() > 0)
    {
        // 処理...
    }
}

// ✅ ノイズが少ない
foreach (var customer in customers.Where(HasOrders))
{
    // 処理...
}
```

### A.1.3 実践ガイドライン

1. **メソッド名で意図を表現する**
2. **変数名で役割を明確にする**
3. **処理の流れを自然言語に近づける**
4. **複雑な条件式には意味のある名前を付ける**
5. **マジックナンバーを定数で置き換える**

## A.2 第二箇条:単一責務の原則

### A.2.1 単一責務の定義

一つのクラス、メソッド、変数は**一つの責務のみ**を持つべきである。変更が起こる理由は一つであるべきという原則。

#### クラスレベルでの単一責務

_[C#]_
```csharp
// ❌ 複数の責務を持つクラス
public class CustomerManager
{
    public void SaveCustomer(Customer customer) { /* データ保存 */ }
    public void SendEmail(Customer customer) { /* メール送信 */ }
    public string GenerateReport(Customer customer) { /* レポート生成 */ }
    public bool ValidateCustomer(Customer customer) { /* バリデーション */ }
}

// ✅ 単一責務に分離
public class CustomerRepository
{
    public void Save(Customer customer) { /* データ保存専門 */ }
}

public class CustomerEmailService
{
    public void SendWelcomeEmail(Customer customer) { /* メール送信専門 */ }
}

public class CustomerReportGenerator
{
    public string GenerateCustomerReport(Customer customer) { /* レポート生成専門 */ }
}

public class CustomerValidator
{
    public ValidationResult Validate(Customer customer) { /* バリデーション専門 */ }
}
```

### A.2.2 メソッドレベルでの単一責務

_[C#]_
```csharp
// ❌ 複数の責務を持つメソッド
public void ProcessOrder(Order order)
{
    // バリデーション
    if (order == null) throw new ArgumentNullException();
    if (order.Items.Count == 0) throw new InvalidOperationException();

    // 在庫チェック
    foreach (var item in order.Items)
    {
        if (inventory.GetStock(item.ProductId) < item.Quantity)
            throw new InsufficientStockException();
    }

    // 価格計算
    decimal total = 0;
    foreach (var item in order.Items)
    {
        total += item.Price * item.Quantity;
    }
    order.TotalAmount = total;

    // 保存
    orderRepository.Save(order);

    // 通知
    emailService.SendOrderConfirmation(order);
}

// ✅ 単一責務に分離
public void ProcessOrder(Order order)
{
    ValidateOrder(order);
    CheckInventoryAvailability(order);
    CalculateOrderTotal(order);
    SaveOrder(order);
    SendOrderConfirmation(order);
}
```

## A.3 第三箇条:的確な名前付け

### A.3.1 名前付けの重要性

名前付けは**モデリングの核心**である。適切な名前により、概念を明確化し、システムの理解を促進する。

#### 良い名前の特徴
1. **目的が明確**
2. **誤解を招かない**
3. **検索しやすい**
4. **発音しやすい**
5. **一貫性がある**

### A.3.2 名前付けのパターン

#### 動詞の使い分け

_[C#]_
```csharp
// Create vs Generate vs Build
public Customer CreateCustomer(CustomerRequest request) // 新規作成
public string GenerateCustomerId() // アルゴリズムによる生成
public CustomerViewModel BuildCustomerView(Customer customer) // 組み立て

// Get vs Find vs Retrieve
public Customer GetCustomer(int id) // 確実に存在する場合
public Customer FindCustomer(string email) // 見つからない可能性がある場合
public Customer RetrieveCustomer(int id) // 外部システムから取得
```

#### 形容詞の活用

_[C#]_
```csharp
// 状態を表す形容詞
public bool IsValid { get; }
public bool IsEmpty { get; }
public bool IsEnabled { get; }
public bool HasOrders { get; }
public bool CanProcess { get; }
```

### A.3.3 アンチパターン

_[C#]_
```csharp
// ❌ 避けるべき名前付け
public class CustomerInfo { } // Info は曖昧
public void DoStuff() { } // Stuff は意味不明
public int num1, num2; // 数字による区別
public string str; // 型名の使用
public void ProcessData(object data) // 汎用的すぎる
```

## A.4 第四箇条:Once And Only Once

### A.4.1 重複排除の原則

同じ意図のコードが複数箇所に書かれていない状態。重複は保守性を著しく低下させる。

#### 重複の種類

##### 1. 完全重複

_[C#]_
```csharp
// ❌ 完全重複
public void ProcessOrderA(Order order)
{
    if (order.TotalAmount > 1000)
    {
        order.DiscountRate = 0.1m;
        order.TotalAmount *= (1 - order.DiscountRate);
    }
}

public void ProcessOrderB(Order order)
{
    if (order.TotalAmount > 1000)
    {
        order.DiscountRate = 0.1m;
        order.TotalAmount *= (1 - order.DiscountRate);
    }
}

// ✅ 重複排除
public void ProcessOrder(Order order)
{
    ApplyVolumeDiscount(order);
}

private void ApplyVolumeDiscount(Order order)
{
    if (order.TotalAmount > 1000)
    {
        order.DiscountRate = 0.1m;
        order.TotalAmount *= (1 - order.DiscountRate);
    }
}
```

##### 2. 意図の重複(構造的重複)

_[C#]_
```csharp
// ❌ 構造的重複
public bool IsValidEmail(string email)
{
    return !string.IsNullOrEmpty(email) && email.Contains("@");
}

public bool IsValidPhone(string phone)
{
    return !string.IsNullOrEmpty(phone) && phone.Length >= 10;
}

// ✅ 共通パターンの抽出
public bool IsValidFormat(string input, Func<string, bool> validator)
{
    return !string.IsNullOrEmpty(input) && validator(input);
}

public bool IsValidEmail(string email) =>
    IsValidFormat(email, e => e.Contains("@"));

public bool IsValidPhone(string phone) =>
    IsValidFormat(phone, p => p.Length >= 10);
```

### A.4.2 設定の重複排除

_[C#]_
```csharp
// ❌ 設定値の重複
public class EmailSettings
{
    public const int MaxRetryCount = 3; // 複数箇所で定義
}

public class OrderProcessing
{
    public const int MaxRetryCount = 3; // 同じ値が重複
}

// ✅ 共通設定の抽出
public static class ApplicationSettings
{
    public const int MaxRetryCount = 3;
    public const int DefaultTimeoutSeconds = 30;
    public const string DefaultCurrency = "JPY";
}
```

## A.5 第五箇条:的確に記述されたメソッド

### A.5.1 適切な抽象化レベル

メソッド内が**同じ抽象化レベル**で統一されていること。

#### 抽象化レベルの統一

_[C#]_
```csharp
// ❌ 抽象化レベルが混在
public void ProcessCustomerRegistration(CustomerRequest request)
{
    // 高レベルの処理
    var customer = CreateCustomerFromRequest(request);

    // 低レベルの詳細処理が混在
    using (var connection = new SqlConnection(connectionString))
    {
        connection.Open();
        var command = new SqlCommand("INSERT INTO Customers...", connection);
        command.Parameters.AddWithValue("@Name", customer.Name);
        command.ExecuteNonQuery();
    }

    // 高レベルの処理
    SendWelcomeEmail(customer);
}

// ✅ 抽象化レベルの統一
public void ProcessCustomerRegistration(CustomerRequest request)
{
    var customer = CreateCustomerFromRequest(request);
    SaveCustomer(customer);
    SendWelcomeEmail(customer);
}
```

### A.5.2 適切なメソッドサイズ

#### 理想的なメソッドサイズ

- **5-15行程度**が理想
- **一画面に収まる**サイズ
- **一つの概念**を表現

_[C#]_
```csharp
// ✅ 適切なサイズのメソッド
public ValidationResult ValidateCustomer(Customer customer)
{
    if (customer == null)
        return ValidationResult.Failure("Customer is required");

    if (string.IsNullOrEmpty(customer.Name))
        return ValidationResult.Failure("Customer name is required");

    if (!IsValidEmail(customer.Email))
        return ValidationResult.Failure("Valid email is required");

    return ValidationResult.Success();
}
```

## A.6 第六箇条:ルールの統一

### A.6.1 コーディング規約の統一

#### 命名規則

_[C#]_
```csharp
// クラス名:PascalCase
public class CustomerService { }

// メソッド名:PascalCase
public void ProcessOrder() { }

// 変数名:camelCase
private string customerName;

// 定数:PascalCase
public const int MaxRetryCount = 3;

// プライベートフィールド:アンダースコア + camelCase
private readonly ICustomerRepository _customerRepository;
```

#### フォーマット規則

_[C#]_
```csharp
// ✅ 統一されたフォーマット
public class CustomerService
{
    private readonly ICustomerRepository _repository;

    public CustomerService(ICustomerRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Customer> GetCustomerAsync(int customerId)
    {
        if (customerId <= 0)
            throw new ArgumentException("Customer ID must be positive", nameof(customerId));

        return await _repository.GetByIdAsync(customerId);
    }
}
```

### A.6.2 エラーハンドリングの統一

_[C#]_
```csharp
// ✅ 統一されたエラーハンドリングパターン
public class StandardErrorHandling
{
    public async Task<Result<T>> ExecuteWithErrorHandlingAsync<T>(Func<Task<T>> operation)
    {
        try
        {
            var result = await operation();
            return Result<T>.Success(result);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error occurred");
            return Result<T>.ValidationFailure(ex.Message);
        }
        catch (NotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found");
            return Result<T>.NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error occurred");
            return Result<T>.Error("An unexpected error occurred");
        }
    }
}
```

## A.7 第七箇条:Testable

### A.7.1 Testableな設計

コードが正しく動作していることを**検証しやすい**状態。

#### 依存関係の注入

_[C#]_
```csharp
// ❌ テストしにくい設計
public class OrderService
{
    public void ProcessOrder(Order order)
    {
        // 直接的な依存関係
        var repository = new OrderRepository();
        var emailService = new EmailService();

        repository.Save(order);
        emailService.SendConfirmation(order);
    }
}

// ✅ Testableな設計
public class OrderService
{
    private readonly IOrderRepository _repository;
    private readonly IEmailService _emailService;

    public OrderService(IOrderRepository repository, IEmailService emailService)
    {
        _repository = repository;
        _emailService = emailService;
    }

    public void ProcessOrder(Order order)
    {
        _repository.Save(order);
        _emailService.SendConfirmation(order);
    }
}
```

### A.7.2 純粋関数の活用

_[C#]_
```csharp
// ✅ 純粋関数(テストしやすい)
public static class TaxCalculator
{
    public static decimal CalculateTax(decimal amount, decimal taxRate)
    {
        return amount * taxRate;
    }

    public static decimal CalculateTotal(decimal amount, decimal taxRate)
    {
        return amount + CalculateTax(amount, taxRate);
    }
}

// テストコード
[Test]
public void CalculateTax_ShouldReturnCorrectAmount()
{
    // Arrange
    var amount = 1000m;
    var taxRate = 0.1m;

    // Act
    var result = TaxCalculator.CalculateTax(amount, taxRate);

    // Assert
    Assert.AreEqual(100m, result);
}
```
## A.8 七箇条実践ガイド:Before/After コード比較

### 実践的なリファクタリング例

#### 第一箇条: 意図を表現

##### Before: 意図が不明確

```csharp
public void Process(List<object> data)
{
    var temp = new List<object>();
    for (int i = 0; i < data.Count; i++)
    {
        if (((Customer)data[i]).Status == 1)
        {
            temp.Add(data[i]);
        }
    }
    // さらに処理...
}
```

##### After: 意図が明確

_[C#]_
```csharp
public List<Customer> GetActiveCustomers(List<Customer> customers)
{
    return customers.Where(customer => customer.IsActive).ToList();
}

public void ProcessActiveCustomers(List<Customer> customers)
{
    var activeCustomers = GetActiveCustomers(customers);
    // 具体的な処理...
}
```

**改善ポイント:**
- ✅ メソッド名で意図を表現
- ✅ 適切な型を使用
- ✅ LINQ による宣言的記述

#### 第二箇条: ノイズを最小化

##### Before: ノイズが多い

_[C#]_
```csharp
public decimal CalculatePrice(Product product)
{
    decimal price = 0.0m; // 不要な初期化
    price = product.BasePrice; // 分離する必要がない処理

    // 自明なコメント(ノイズ)
    if (product.Discount > 0) // 割引があるかチェック
    {
        price = price - (price * product.Discount); // 割引を適用
    }

    return price; // 価格を返す(不要なコメント)
}
```

##### After: ノイズを削除

_[C#]_
```csharp
public decimal CalculatePrice(Product product)
{
    var basePrice = product.BasePrice;
    return product.HasDiscount
        ? basePrice * (1 - product.Discount)
        : basePrice;
}
```

**改善ポイント:**
- ✅ 不要な変数を削除
- ✅ 自明なコメントを削除
- ✅ 三項演算子で簡潔に

#### 第三箇条: 対称性を保つ

##### Before: 非対称な構造

_[C#]_
```csharp
public string FormatCustomerInfo(Customer customer)
{
    if (customer.Type == CustomerType.Premium)
    {
        return $"[PREMIUM] {customer.Name} - {customer.Email}";
    }
    else if (customer.Type == CustomerType.Regular)
    {
        return $"{customer.Name} - {customer.Email}";
    }
    return "Unknown Customer";
}
```

##### After: 対称性を保つ

_[C#]_
```csharp
public string FormatCustomerInfo(Customer customer)
{
    return customer.Type switch
    {
        CustomerType.Premium => $"[PREMIUM] {customer.Name} - {customer.Email}",
        CustomerType.Regular => $"{customer.Name} - {customer.Email}",
        CustomerType.Guest => $"[GUEST] {customer.Name}",
        _ => "Unknown Customer"
    };
}
```

**改善ポイント:**
- ✅ すべてのケースが同じ構造
- ✅ switch式による統一的な記述
- ✅ 未知のケースも対称的に処理

#### 第四箇条: 階層化する

##### Before: 抽象度が混在

_[C#]_
```csharp
public void ProcessOrder(Order order)
{
    // 高レベルの概念
    if (order.Items.Count == 0)
        throw new InvalidOperationException("Empty order");

    // 低レベルの実装詳細が混入
    using (var connection = new SqlConnection(connectionString))
    {
        connection.Open();
        var sql = "INSERT INTO Orders (Id, CustomerId, Total) VALUES (@id, @customerId, @total)";
        var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@id", order.Id);
        command.Parameters.AddWithValue("@customerId", order.CustomerId);
        command.Parameters.AddWithValue("@total", order.Total);
        command.ExecuteNonQuery();
    }

    // 高レベルの概念
    SendConfirmationEmail(order);
}
```

##### After: 適切に階層化

_[C#]_
```csharp
public async Task ProcessOrder(Order order)
{
    ValidateOrder(order);
    await SaveOrder(order);
    await SendConfirmationEmail(order);
}

private void ValidateOrder(Order order)
{
    if (order.Items.Count == 0)
        throw new InvalidOperationException("Empty order");
}

private async Task SaveOrder(Order order)
{
    await _orderRepository.SaveAsync(order);
}
```

**改善ポイント:**
- ✅ 抽象度レベルを統一
- ✅ 低レベル詳細を別メソッドに分離
- ✅ 読みやすい流れ

#### 第五箇条: 線形化する

##### Before: 複雑なネスト

_[C#]_
```csharp
public string ProcessCustomerData(Customer customer)
{
    if (customer != null)
    {
        if (customer.IsActive)
        {
            if (customer.HasValidEmail)
            {
                if (customer.Orders.Count > 0)
                {
                    return "Valid active customer with orders";
                }
                else
                {
                    return "Valid active customer without orders";
                }
            }
            else
            {
                return "Active customer with invalid email";
            }
        }
        else
        {
            return "Inactive customer";
        }
    }
    else
    {
        return "Customer is null";
    }
}
```

##### After: 線形化された構造

_[C#]_
```csharp
public string ProcessCustomerData(Customer customer)
{
    if (customer == null)
        return "Customer is null";

    if (!customer.IsActive)
        return "Inactive customer";

    if (!customer.HasValidEmail)
        return "Active customer with invalid email";

    return customer.Orders.Count > 0
        ? "Valid active customer with orders"
        : "Valid active customer without orders";
}
```

**改善ポイント:**
- ✅ Early Return パターン
- ✅ ネストの解消
- ✅ 読みやすい線形構造

#### 第六箇条: ルールの統一

##### Before: 一貫性のない命名

_[C#]_
```csharp
public class UserService
{
    public User getUser(int id) { }           // camelCase
    public void SaveUser(User user) { }       // PascalCase
    public bool user_exists(int id) { }       // snake_case
    public List<User> GetUsers() { }          // PascalCase
}
```

##### After: 統一されたルール

_[C#]_
```csharp
public class UserService
{
    public User GetUser(int id) { }
    public void SaveUser(User user) { }
    public bool UserExists(int id) { }
    public List<User> GetUsers() { }
}
```

**改善ポイント:**
- ✅ PascalCaseで統一
- ✅ 一貫した命名パターン
- ✅ 予測可能なAPI

#### 第七箇条: 自動化する

##### Before: 手動による繰り返し作業

_[C#]_
```csharp
public class CustomerProcessor
{
    public void ProcessCustomers()
    {
        var customers = GetCustomers();

        // 手動でのデータ変換
        foreach (var customer in customers)
        {
            customer.Name = customer.Name.Trim().ToUpper();
            customer.Email = customer.Email.ToLower();

            // 手動でのバリデーション
            if (string.IsNullOrEmpty(customer.Name))
                throw new Exception("Invalid name");
            if (!customer.Email.Contains("@"))
                throw new Exception("Invalid email");

            // 手動での保存
            SaveCustomer(customer);
        }
    }
}
```

##### After: 自動化された処理

_[C#]_
```csharp
public class CustomerProcessor
{
    private readonly IDataNormalizer _normalizer;
    private readonly IValidator<Customer> _validator;
    private readonly IRepository<Customer> _repository;

    public async Task ProcessCustomers()
    {
        var customers = await GetCustomers();

        var processedCustomers = customers
            .Select(_normalizer.Normalize)    // 自動変換
            .Where(_validator.IsValid)        // 自動バリデーション
            .ToList();

        await _repository.SaveAllAsync(processedCustomers); // 自動保存
    }
}
```

**改善ポイント:**
- ✅ 変換処理の自動化
- ✅ バリデーションの自動化
- ✅ バッチ処理による効率化

### 七箇条の統合的適用

_[C#]_
```csharp
// 七箇条を統合的に適用した美しいコードの例
public class OrderService
{
    private readonly IOrderRepository _repository;
    private readonly IPaymentService _paymentService;
    private readonly INotificationService _notificationService;

    public async Task<OrderResult> ProcessOrder(CreateOrderRequest request)
    {
        // 第一箇条: 意図を表現 - メソッド名で処理内容が明確
        // 第四箇条: 階層化 - 高レベルの処理フローに統一

        var order = CreateOrder(request);          // 注文作成
        var paymentResult = await ProcessPayment(order); // 決済処理

        if (!paymentResult.IsSuccessful)           // 第五箇条: 線形化 - Early Return
            return OrderResult.Failed(paymentResult.ErrorMessage);

        await SaveOrder(order);                    // 注文保存
        await SendConfirmation(order);             // 確認通知送信

        return OrderResult.Success(order);         // 第三箇条: 対称性 - 成功/失敗の対称的処理
    }

    // 第六箇条: ルールの統一 - 一貫した命名規則とパターン
    // 第七箇条: 自動化 - 依存性注入による自動的な協調動作
}
```

## A.9 実践チェックリスト

### A.9.1 コードレビュー用チェックリスト

#### 意図を表現
- [ ] メソッド名から何をするか理解できるか?
- [ ] 変数名から役割が明確か?
- [ ] コメントなしで意図が理解できるか?

#### 単一責務の原則
- [ ] メソッドは一つのことだけをしているか?
- [ ] クラスの変更理由は一つに限定されているか?
- [ ] 責務が適切に分離されているか?

#### 的確な名前付け
- [ ] 名前から機能が想像できるか?
- [ ] 一貫した命名規則に従っているか?
- [ ] 略語を避けているか?

#### Once And Only Once
- [ ] 重複したコードはないか?
- [ ] 同じ処理が複数箇所にないか?
- [ ] 共通化できる部分はないか?

#### 的確に記述されたメソッド
- [ ] 抽象化レベルが統一されているか?
- [ ] メソッドサイズは適切か?
- [ ] 一つの概念を表現しているか?

#### ルールの統一
- [ ] コーディング規約に従っているか?
- [ ] フォーマットが統一されているか?
- [ ] エラーハンドリングが一貫しているか?

#### Testable
- [ ] 依存関係が注入可能か?
- [ ] 単体テストが書きやすいか?
- [ ] 外部リソースへの依存を分離できているか?

### A.9.2 実装ガイドライン

#### 新機能実装時
1. **要件の理解**: 何を実現したいかを明確にする
2. **設計**: 七箇条に従って設計する
3. **実装**: 一つずつ確実に実装する
4. **テスト**: 各箇条を満たしているか確認する
5. **レビュー**: チームメンバーと確認する

#### リファクタリング時
1. **問題の特定**: どの箇条に違反しているか分析する
2. **優先順位**: 影響の大きい問題から対処する
3. **段階的改善**: 一度に全てを変更せず、段階的に改善する
4. **テスト**: 既存機能が壊れていないか確認する
5. **継続**: 継続的に改善を続ける

美しいソースコードのための七箇条は、単なるルールではない。それは、保守性が高く、理解しやすく、変更に強いソフトウェアを作るための**指針**である。これらの原則を日々の開発に取り入れることで、技術的負債の蓄積を防ぎ、持続可能な開発を実現できる。

---

**[← 目次に戻る](table-of-contents.md)**