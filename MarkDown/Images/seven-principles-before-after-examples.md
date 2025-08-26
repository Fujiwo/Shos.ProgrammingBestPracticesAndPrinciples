# 七箇条実践ガイド:Before/After コード比較

## 実践的なリファクタリング例

### 第一箇条: 意図を表現

#### Before: 意図が不明確
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

#### After: 意図が明確
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

### 第二箇条: ノイズを最小化

#### Before: ノイズが多い
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

#### After: ノイズを削除
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

### 第三箇条: 対称性を保つ

#### Before: 非対称な構造
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

#### After: 対称性を保つ
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

### 第四箇条: 階層化する

#### Before: 抽象度が混在
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

#### After: 適切に階層化
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

### 第五箇条: 線形化する

#### Before: 複雑なネスト
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

#### After: 線形化された構造
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

### 第六箇条: ルールの統一

#### Before: 一貫性のない命名
```csharp
public class UserService
{
    public User getUser(int id) { }           // camelCase
    public void SaveUser(User user) { }       // PascalCase
    public bool user_exists(int id) { }       // snake_case
    public List<User> GetUsers() { }          // PascalCase
}
```

#### After: 統一されたルール
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

### 第七箇条: 自動化する

#### Before: 手動による繰り返し作業
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

#### After: 自動化された処理
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

## 七箇条の統合的適用

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