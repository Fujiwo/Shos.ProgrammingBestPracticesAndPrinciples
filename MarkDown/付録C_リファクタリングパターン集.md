# 付録C リファクタリングパターン集

![付録C バナー](Images/banner_付録C.svg)

## C.1 基本的なリファクタリングパターン

### C.1.1 メソッド抽出(Extract Method)

最も基本的で効果的なリファクタリング手法。長いメソッドを意味のある単位に分割する。

#### Before(リファクタリング前)
```csharp
public void ProcessOrder(Order order)
{
    // バリデーション
    if (order == null)
        throw new ArgumentNullException(nameof(order));
    if (order.Items == null || order.Items.Count == 0)
        throw new ArgumentException("注文に商品が含まれていません");
    if (string.IsNullOrEmpty(order.CustomerEmail))
        throw new ArgumentException("顧客メールアドレスが必要です");
   
    // 在庫チェック
    foreach (var item in order.Items)
    {
        var stock = inventoryService.GetStock(item.ProductId);
        if (stock < item.Quantity)
            throw new InsufficientStockException($"商品 {item.ProductId} の在庫が不足しています");
    }
   
    // 価格計算
    decimal subtotal = 0;
    foreach (var item in order.Items)
    {
        subtotal += item.Price * item.Quantity;
    }
   
    decimal tax = subtotal * 0.1m;
    order.TotalAmount = subtotal + tax;
   
    // 保存
    orderRepository.Save(order);
   
    // 通知
    var emailContent = $"ご注文ありがとうございます。注文番号: {order.Id}、合計金額: {order.TotalAmount:C}";
    emailService.SendEmail(order.CustomerEmail, "注文確認", emailContent);
}
```

#### After(リファクタリング後)
```csharp
public void ProcessOrder(Order order)
{
    ValidateOrder(order);
    CheckInventoryAvailability(order);
    CalculateOrderTotal(order);
    SaveOrder(order);
    SendOrderConfirmation(order);
}

private void ValidateOrder(Order order)
{
    if (order == null)
        throw new ArgumentNullException(nameof(order));
    if (order.Items == null || order.Items.Count == 0)
        throw new ArgumentException("注文に商品が含まれていません");
    if (string.IsNullOrEmpty(order.CustomerEmail))
        throw new ArgumentException("顧客メールアドレスが必要です");
}

private void CheckInventoryAvailability(Order order)
{
    foreach (var item in order.Items)
    {
        var stock = inventoryService.GetStock(item.ProductId);
        if (stock < item.Quantity)
            throw new InsufficientStockException($"商品 {item.ProductId} の在庫が不足しています");
    }
}

private void CalculateOrderTotal(Order order)
{
    decimal subtotal = order.Items.Sum(item => item.Price * item.Quantity);
    decimal tax = subtotal * TaxRate;
    order.TotalAmount = subtotal + tax;
}

private void SaveOrder(Order order)
{
    orderRepository.Save(order);
}

private void SendOrderConfirmation(Order order)
{
    var emailContent = $"ご注文ありがとうございます。注文番号: {order.Id}、合計金額: {order.TotalAmount:C}";
    emailService.SendEmail(order.CustomerEmail, "注文確認", emailContent);
}
```

### C.1.2 変数抽出(Extract Variable)

複雑な式や意味のある値に名前を付けて理解しやすくする。

#### Before
```csharp
public bool IsEligibleForDiscount(Customer customer, Order order)
{
    return customer.RegistrationDate <= DateTime.Now.AddYears(-1) &&
           customer.TotalPurchaseAmount >= 100000 &&
           order.TotalAmount >= 50000;
}
```

#### After
```csharp
public bool IsEligibleForDiscount(Customer customer, Order order)
{
    var isLongTermCustomer = customer.RegistrationDate <= DateTime.Now.AddYears(-1);
    var hasHighLifetimeValue = customer.TotalPurchaseAmount >= 100000;
    var isLargeOrder = order.TotalAmount >= 50000;
   
    return isLongTermCustomer && hasHighLifetimeValue && isLargeOrder;
}
```

### C.1.3 条件式の統合(Consolidate Conditional Expression)

複数の条件が同じ結果を返す場合、条件式を統合して意図を明確にする。

#### Before
```csharp
public decimal GetDiscount(Customer customer)
{
    if (customer.Age < 18) return 0;
    if (customer.IsBlacklisted) return 0;
    if (customer.AccountStatus != AccountStatus.Active) return 0;
   
    // 割引計算...
    return CalculateDiscount(customer);
}
```

#### After
```csharp
public decimal GetDiscount(Customer customer)
{
    if (!IsEligibleForDiscount(customer))
        return 0;
   
    return CalculateDiscount(customer);
}

private bool IsEligibleForDiscount(Customer customer)
{
    return customer.Age >= 18 &&
           !customer.IsBlacklisted &&
           customer.AccountStatus == AccountStatus.Active;
}
```

## C.2 オブジェクト指向リファクタリング

### C.2.1 クラス抽出(Extract Class)

一つのクラスが複数の責務を持っている場合、責務ごとにクラスを分離する。

#### Before
```csharp
public class Customer
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
   
    // 住所情報
    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string ZipCode { get; set; }
    public string Country { get; set; }
   
    // 住所関連メソッド
    public string GetFullAddress()
    {
        return $"{Street}, {City}, {State} {ZipCode}, {Country}";
    }
   
    public bool IsInSameCity(Customer other)
    {
        return this.City == other.City && this.State == other.State;
    }
}
```

#### After
```csharp
public class Customer
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public Address Address { get; set; }
   
    public bool IsInSameCity(Customer other)
    {
        return Address.IsInSameCity(other.Address);
    }
}

public class Address
{
    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string ZipCode { get; set; }
    public string Country { get; set; }
   
    public string GetFullAddress()
    {
        return $"{Street}, {City}, {State} {ZipCode}, {Country}";
    }
   
    public bool IsInSameCity(Address other)
    {
        return this.City == other.City && this.State == other.State;
    }
}
```

### C.2.2 委譲の導入(Introduce Delegation)

継承よりも委譲を使用してコードの柔軟性を向上させる。

#### Before
```csharp
public class DiscountedProduct : Product
{
    public decimal DiscountRate { get; set; }
   
    public override decimal GetPrice()
    {
        return base.GetPrice() * (1 - DiscountRate);
    }
}
```

#### After
```csharp
public class Product
{
    public string Name { get; set; }
    public decimal BasePrice { get; set; }
    public IPricingStrategy PricingStrategy { get; set; }
   
    public decimal GetPrice()
    {
        return PricingStrategy.CalculatePrice(BasePrice);
    }
}

public interface IPricingStrategy
{
    decimal CalculatePrice(decimal basePrice);
}

public class DiscountPricingStrategy : IPricingStrategy
{
    public decimal DiscountRate { get; set; }
   
    public decimal CalculatePrice(decimal basePrice)
    {
        return basePrice * (1 - DiscountRate);
    }
}

public class RegularPricingStrategy : IPricingStrategy
{
    public decimal CalculatePrice(decimal basePrice)
    {
        return basePrice;
    }
}
```

### C.2.3 状態パターンの導入(Replace Conditional with State)

複雑な状態遷移を状態パターンで整理する。

#### Before
```csharp
public class Order
{
    public OrderStatus Status { get; set; }
   
    public void Process()
    {
        switch (Status)
        {
            case OrderStatus.Pending:
                ValidateOrder();
                Status = OrderStatus.Validated;
                break;
            case OrderStatus.Validated:
                ProcessPayment();
                Status = OrderStatus.Paid;
                break;
            case OrderStatus.Paid:
                ShipOrder();
                Status = OrderStatus.Shipped;
                break;
            case OrderStatus.Shipped:
                throw new InvalidOperationException("既に発送済みの注文です");
            default:
                throw new InvalidOperationException($"不正な注文状態: {Status}");
        }
    }
}
```

#### After
```csharp
public class Order
{
    public IOrderState State { get; set; }
   
    public void Process()
    {
        State.Process(this);
    }
   
    public void SetState(IOrderState newState)
    {
        State = newState;
    }
}

public interface IOrderState
{
    void Process(Order order);
}

public class PendingOrderState : IOrderState
{
    public void Process(Order order)
    {
        ValidateOrder(order);
        order.SetState(new ValidatedOrderState());
    }
   
    private void ValidateOrder(Order order)
    {
        // バリデーション処理
    }
}

public class ValidatedOrderState : IOrderState
{
    public void Process(Order order)
    {
        ProcessPayment(order);
        order.SetState(new PaidOrderState());
    }
   
    private void ProcessPayment(Order order)
    {
        // 決済処理
    }
}

public class PaidOrderState : IOrderState
{
    public void Process(Order order)
    {
        ShipOrder(order);
        order.SetState(new ShippedOrderState());
    }
   
    private void ShipOrder(Order order)
    {
        // 発送処理
    }
}

public class ShippedOrderState : IOrderState
{
    public void Process(Order order)
    {
        throw new InvalidOperationException("既に発送済みの注文です");
    }
}
```

## C.3 データ構造のリファクタリング

### C.3.1 プリミティブ型の置換(Replace Primitive with Object)

プリミティブ型を意味のあるオブジェクトに置き換える。

#### Before
```csharp
public class Customer
{
    public string Email { get; set; }
    public string Phone { get; set; }
   
    public bool IsValidEmail()
    {
        return Email != null && Email.Contains("@");
    }
   
    public bool IsValidPhone()
    {
        return Phone != null && Phone.Length >= 10;
    }
}
```

#### After
```csharp
public class Customer
{
    public EmailAddress Email { get; set; }
    public PhoneNumber Phone { get; set; }
}

public class EmailAddress
{
    private readonly string _value;
   
    public EmailAddress(string value)
    {
        if (string.IsNullOrEmpty(value) || !value.Contains("@"))
            throw new ArgumentException("有効なメールアドレスを入力してください");
        _value = value;
    }
   
    public string Value => _value;
   
    public override string ToString() => _value;
   
    public static implicit operator string(EmailAddress email) => email._value;
}

public class PhoneNumber
{
    private readonly string _value;
   
    public PhoneNumber(string value)
    {
        if (string.IsNullOrEmpty(value) || value.Length < 10)
            throw new ArgumentException("有効な電話番号を入力してください");
        _value = value;
    }
   
    public string Value => _value;
   
    public override string ToString() => _value;
   
    public static implicit operator string(PhoneNumber phone) => phone._value;
}
```

### C.3.2 コレクションのカプセル化(Encapsulate Collection)

コレクションへの直接アクセスを防ぎ、安全な操作メソッドを提供する。

#### Before
```csharp
public class Order
{
    public List<OrderItem> Items { get; set; } = new List<OrderItem>();
   
    public decimal TotalAmount
    {
        get { return Items.Sum(item => item.Price * item.Quantity); }
    }
}

// 使用例(問題のある使い方)
var order = new Order();
order.Items.Add(new OrderItem()); // 直接操作
order.Items.Clear(); // 外部から全削除される可能性
```

#### After
```csharp
public class Order
{
    private readonly List<OrderItem> _items = new List<OrderItem>();
   
    public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();
   
    public void AddItem(OrderItem item)
    {
        if (item == null)
            throw new ArgumentNullException(nameof(item));
       
        var existingItem = _items.FirstOrDefault(i => i.ProductId == item.ProductId);
        if (existingItem != null)
        {
            existingItem.IncreaseQuantity(item.Quantity);
        }
        else
        {
            _items.Add(item);
        }
    }
   
    public void RemoveItem(string productId)
    {
        var item = _items.FirstOrDefault(i => i.ProductId == productId);
        if (item != null)
        {
            _items.Remove(item);
        }
    }
   
    public decimal TotalAmount => _items.Sum(item => item.Price * item.Quantity);
}
```

## C.4 レガシーコード対応パターン

### C.4.1 特性化テストの導入(Characterization Tests)

既存コードの動作を保護するテストを作成してからリファクタリングを実行する。

#### ステップ1:現在の動作を記録
```csharp
[Test]
public void CharacterizeCurrentBehavior()
{
    // 既存システムの動作を記録するテスト
    var calculator = new LegacyPriceCalculator();
   
    // 現在の動作を記録(意図通りかどうかは後で検証)
    Assert.AreEqual(1100, calculator.CalculatePrice(1000, "PREMIUM"));
    Assert.AreEqual(900, calculator.CalculatePrice(1000, "DISCOUNT"));
    Assert.AreEqual(1000, calculator.CalculatePrice(1000, "REGULAR"));
    Assert.AreEqual(1000, calculator.CalculatePrice(1000, "UNKNOWN")); // 既存の動作
}
```

#### ステップ2:安全にリファクタリング
```csharp
// リファクタリング前
public class LegacyPriceCalculator
{
    public decimal CalculatePrice(decimal basePrice, string customerType)
    {
        if (customerType == "PREMIUM")
        {
            return basePrice * 1.1m;
        }
        else if (customerType == "DISCOUNT")
        {
            return basePrice * 0.9m;
        }
        else if (customerType == "REGULAR")
        {
            return basePrice;
        }
        else
        {
            return basePrice; // 不明な場合の動作
        }
    }
}

// リファクタリング後
public class PriceCalculator
{
    private readonly Dictionary<string, decimal> _multipliers = new Dictionary<string, decimal>
    {
        { "PREMIUM", 1.1m },
        { "DISCOUNT", 0.9m },
        { "REGULAR", 1.0m }
    };
   
    public decimal CalculatePrice(decimal basePrice, string customerType)
    {
        var multiplier = _multipliers.GetValueOrDefault(customerType, 1.0m);
        return basePrice * multiplier;
    }
}
```

### C.4.2 ストラングラーパターン(Strangler Pattern)

レガシーシステムを段階的に新システムに置き換える。

#### フェーズ1:プロキシの導入
```csharp
public class CustomerServiceProxy : ICustomerService
{
    private readonly LegacyCustomerService _legacyService;
    private readonly NewCustomerService _newService;
    private readonly IFeatureToggle _featureToggle;
   
    public CustomerServiceProxy(
        LegacyCustomerService legacyService,
        NewCustomerService newService,
        IFeatureToggle featureToggle)
    {
        _legacyService = legacyService;
        _newService = newService;
        _featureToggle = featureToggle;
    }
   
    public Customer GetCustomer(int id)
    {
        if (_featureToggle.IsEnabled("UseNewCustomerService"))
        {
            return _newService.GetCustomer(id);
        }
        else
        {
            return _legacyService.GetCustomer(id);
        }
    }
}
```

#### フェーズ2:段階的移行
```csharp
public class MigrationCustomerService : ICustomerService
{
    private readonly LegacyCustomerService _legacyService;
    private readonly NewCustomerService _newService;
   
    public Customer GetCustomer(int id)
    {
        // 新サービスで取得を試行
        try
        {
            var customer = _newService.GetCustomer(id);
            if (customer != null)
            {
                return customer;
            }
        }
        catch (Exception ex)
        {
            // ログ出力後、レガシーサービスにフォールバック
            _logger.LogWarning(ex, "新サービスでの取得に失敗、レガシーサービスを使用");
        }
       
        // レガシーサービスを使用
        return _legacyService.GetCustomer(id);
    }
}
```

## C.5 パフォーマンス改善パターン

### C.5.1 遅延評価の導入(Introduce Lazy Evaluation)

重い処理を必要になるまで遅延させる。

#### Before
```csharp
public class ProductCatalog
{
    public List<Product> Products { get; }
    public Dictionary<string, List<Product>> ProductsByCategory { get; }
   
    public ProductCatalog(IProductRepository repository)
    {
        Products = repository.GetAllProducts(); // 初期化時に全取得
        ProductsByCategory = Products.GroupBy(p => p.Category)
                                    .ToDictionary(g => g.Key, g => g.ToList()); // 初期化時に全グループ化
    }
}
```

#### After
```csharp
public class ProductCatalog
{
    private readonly IProductRepository _repository;
    private readonly Lazy<List<Product>> _products;
    private readonly Lazy<Dictionary<string, List<Product>>> _productsByCategory;
   
    public ProductCatalog(IProductRepository repository)
    {
        _repository = repository;
        _products = new Lazy<List<Product>>(() => _repository.GetAllProducts());
        _productsByCategory = new Lazy<Dictionary<string, List<Product>>>(
            () => _products.Value.GroupBy(p => p.Category)
                                .ToDictionary(g => g.Key, g => g.ToList()));
    }
   
    public List<Product> Products => _products.Value;
    public Dictionary<string, List<Product>> ProductsByCategory => _productsByCategory.Value;
}
```

### C.5.2 メモ化の導入(Introduce Memoization)

計算結果をキャッシュして同じ計算の繰り返しを避ける。

#### Before
```csharp
public class PriceCalculator
{
    public decimal CalculateComplexPrice(Product product, Customer customer, DateTime date)
    {
        // 複雑で時間のかかる計算
        var basePrice = product.BasePrice;
        var seasonalMultiplier = GetSeasonalMultiplier(date);
        var customerDiscount = GetCustomerDiscount(customer);
        var complexAdjustment = PerformComplexCalculation(product, customer, date);
       
        return basePrice * seasonalMultiplier * customerDiscount * complexAdjustment;
    }
   
    private decimal PerformComplexCalculation(Product product, Customer customer, DateTime date)
    {
        // 重い計算処理
        Thread.Sleep(100); // 重い処理のシミュレーション
        return 1.0m;
    }
}
```

#### After
```csharp
public class PriceCalculator
{
    private readonly Dictionary<string, decimal> _cache = new Dictionary<string, decimal>();
   
    public decimal CalculateComplexPrice(Product product, Customer customer, DateTime date)
    {
        var cacheKey = $"{product.Id}_{customer.Id}_{date:yyyyMMdd}";
       
        if (_cache.ContainsKey(cacheKey))
        {
            return _cache[cacheKey];
        }
       
        var result = CalculateComplexPriceInternal(product, customer, date);
        _cache[cacheKey] = result;
       
        return result;
    }
   
    private decimal CalculateComplexPriceInternal(Product product, Customer customer, DateTime date)
    {
        var basePrice = product.BasePrice;
        var seasonalMultiplier = GetSeasonalMultiplier(date);
        var customerDiscount = GetCustomerDiscount(customer);
        var complexAdjustment = PerformComplexCalculation(product, customer, date);
       
        return basePrice * seasonalMultiplier * customerDiscount * complexAdjustment;
    }
}
```

## C.6 リファクタリングの実践ガイドライン

### C.6.1 安全なリファクタリング手順

1. **テストの準備**: 既存の動作を保護するテストを作成
2. **小さな変更**: 一度に一つのリファクタリングを実行
3. **テスト実行**: 各変更後にテストを実行
4. **コミット**: 動作を確認できたら変更をコミット
5. **反復**: 次のリファクタリングに進む

### C.6.2 リファクタリングの優先順位

#### 高優先度
- **コードクローン**: 重複したコードの統合
- **長いメソッド**: メソッドの分割
- **大きなクラス**: クラスの分割
- **長いパラメータリスト**: パラメータオブジェクトの導入

#### 中優先度
- **複雑な条件式**: 条件式の簡素化
- **プリミティブ型の濫用**: 値オブジェクトの導入
- **不適切な親密**: 結合度の削減

#### 低優先度
- **命名の改善**: より分かりやすい名前への変更
- **コメントの削除**: 自明なコメントの除去
- **デッドコードの削除**: 使用されていないコードの除去

### C.6.3 リファクタリング後の検証項目

- [ ] すべてのテストが通っているか
- [ ] 新しいテストケースが必要か
- [ ] パフォーマンスに悪影響がないか
- [ ] 可読性が向上したか
- [ ] 保守性が向上したか
- [ ] コードの重複が減ったか
- [ ] 設計原則に準拠しているか

リファクタリングは継続的な改善活動である。完璧を目指すのではなく、段階的に品質を向上させることが重要である。常にテストに支えられた安全な環境で、小さな変更を積み重ねることで、保守性の高いコードベースを築くことができる。