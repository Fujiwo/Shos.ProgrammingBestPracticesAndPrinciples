# 第6章 テスト駆動開発とTestable設計

![第6章バナー](Images/chapter-06-banner.svg)

## 章の概要

### この章の目的
テスト駆動開発(TDD)の本質を理解し、「Testable」という美しいコードの最重要特性を身につける。単なるテスト技法を超えて、テストによって駆動される設計思考と、検証可能なソフトウェア構築の哲学を習得する。

### この章で学べること
- Testableな設計の深層的な意味と価値
- 単体テストの基本原則と効果的な作成技法
- テスト駆動開発(TDD)のRed-Green-Refactorサイクル
- テストコードそのものの品質向上技法
- 依存関係の注入によるテスタビリティ向上
- モックとスタブの効果的な活用
- フィードバックループの最大化による開発効率向上

### なぜTestableであることが決定的に重要なのか
「テストを書く時間がない」「仕様がころころ変わるからテストは後回し」──こんな言葉を聞いたことがあるだろう。しかし、Testableな設計は時間を節約するものであり、決して時間を消費するものではない。この章で学ぶTDD思考は、あなたの開発スタイルを根本的に変革する。不安に満ちた「動くかどうか分からないコード」から、確信を持って変更できる「検証済みのコード」へ。その転換点がここにある。

---

## 6.1 Testableな設計の重要性

### 6.1.1 Testableとは何か

美しいソースコードのための七箇条の最後に掲げられる「Testable」は、単にテストが書けるということ以上の深い意味を持つ。Testableな設計とは、**正しい記述であることが分かり、検証が容易であること**を意味する。

> 「テストできないコードは、正しく動作しているかどうかを検証できない」

この原則は、ソフトウェアの品質保証の根幹をなす。テストできないコードは、事実上「ブラックボックス」であり、期待通りに動作するかどうかを客観的に判断する手段が存在しない。

![テスト戦略とテスタブル設計パターン](Images/testing-strategies-comparison.md)

### 6.1.2 Testabilityが品質に与える影響

Testableな設計は、非機能品質の向上に直接的に寄与する:

#### 理解容易性(Understandability)の向上

_[C#]_
```csharp
// Testableでない設計例
public class OrderProcessor
{
    public void ProcessOrder(int orderId)
    {
        // データベースから直接取得
        using var connection = new SqlConnection(connectionString);
        var order = GetOrderFromDatabase(connection, orderId);
       
        // 外部サービスに直接依存
        var paymentService = new PaymentService();
        var result = paymentService.ProcessPayment(order.Amount);
       
        // ファイルシステムに直接書き込み
        File.WriteAllText($"order_{orderId}.log", $"Processed at {DateTime.Now}");
       
        // メール送信
        var emailService = new EmailService();
        emailService.SendConfirmation(order.CustomerEmail);
    }
}
```

この設計では、何がテストできて何がテストできないのかが明確でない。

_[C#]_
```csharp
// Testableな設計例
public class OrderProcessor
{
    private readonly IOrderRepository _orderRepository;
    private readonly IPaymentService _paymentService;
    private readonly ILogger _logger;
    private readonly IEmailService _emailService;
   
    public OrderProcessor(
        IOrderRepository orderRepository,
        IPaymentService paymentService,
        ILogger logger,
        IEmailService emailService)
    {
        _orderRepository = orderRepository;
        _paymentService = paymentService;
        _logger = logger;
        _emailService = emailService;
    }
   
    public async Task<OrderProcessingResult> ProcessOrderAsync(int orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
            return OrderProcessingResult.NotFound();
           
        var paymentResult = await _paymentService.ProcessPaymentAsync(order.Amount);
        if (!paymentResult.IsSuccess)
            return OrderProcessingResult.PaymentFailed(paymentResult.ErrorMessage);
           
        _logger.LogOrderProcessed(orderId);
        await _emailService.SendConfirmationAsync(order.CustomerEmail);
       
        return OrderProcessingResult.Success();
    }
}
```

Testableな設計では、各依存関係が明確に分離され、個別にテストできる。

#### 変更容易性(Ease of Change)の向上

Testableな設計は自然と疎結合な設計となり、変更に対する耐性が向上する。

_[C#]_
```csharp
// テスト例:支払い処理の失敗ケース
[Test]
public async Task ProcessOrder_PaymentFails_ReturnsPaymentFailedResult()
{
    // Arrange
    var mockOrderRepo = new Mock<IOrderRepository>();
    var mockPaymentService = new Mock<IPaymentService>();
    var mockLogger = new Mock<ILogger>();
    var mockEmailService = new Mock<IEmailService>();
   
    var order = new Order { Id = 1, Amount = 100, CustomerEmail = "test@example.com" };
    mockOrderRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);
    mockPaymentService.Setup(p => p.ProcessPaymentAsync(100))
                     .ReturnsAsync(PaymentResult.Failed("Insufficient funds"));
   
    var processor = new OrderProcessor(
        mockOrderRepo.Object,
        mockPaymentService.Object,
        mockLogger.Object,
        mockEmailService.Object);
   
    // Act
    var result = await processor.ProcessOrderAsync(1);
   
    // Assert
    Assert.IsFalse(result.IsSuccess);
    Assert.AreEqual("Insufficient funds", result.ErrorMessage);
   
    // メール送信が呼ばれていないことを確認
    mockEmailService.Verify(e => e.SendConfirmationAsync(It.IsAny<string>()), Times.Never);
}
```

### 6.1.3 Testableな設計の原則

#### 依存性の注入(Dependency Injection)

外部リソースや他のサービスへの依存は、コンストラクタやメソッドの引数として注入する。

_[C#]_
```csharp
// 悪い例:依存性がハードコーディングされている
public class UserService
{
    public User GetUser(int id)
    {
        var database = new SqlDatabase(); // ハードコーディング
        return database.GetUser(id);
    }
}

// 良い例:依存性が注入される
public class UserService
{
    private readonly IUserRepository _userRepository;
   
    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
   
    public User GetUser(int id)
    {
        return _userRepository.GetById(id);
    }
}
```

#### 純粋関数の活用

副作用のない純粋関数は、最もテストしやすい形式である。

_[Python]_
```python
# 純粋関数の例
def calculate_tax(price: float, tax_rate: float) -> float:
    """純粋関数:同じ入力に対して常に同じ出力を返す"""
    return price * tax_rate

# テストが簡単
def test_calculate_tax():
    assert calculate_tax(100.0, 0.08) == 8.0
    assert calculate_tax(200.0, 0.10) == 20.0
```

#### 状態の明示的管理

オブジェクトの状態変化を明示的に管理し、予測可能にする。

_[Java]_
```java
// 状態管理の良い例
public class BankAccount {
    private final String accountNumber;
    private BigDecimal balance;
    private final List<Transaction> transactions;
   
    public BankAccount(String accountNumber, BigDecimal initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.transactions = new ArrayList<>();
    }
   
    public WithdrawResult withdraw(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return WithdrawResult.invalidAmount();
        }
       
        if (balance.compareTo(amount) < 0) {
            return WithdrawResult.insufficientFunds();
        }
       
        balance = balance.subtract(amount);
        transactions.add(new Transaction(TransactionType.WITHDRAW, amount));
        return WithdrawResult.success(balance);
    }
   
    // テスト用のゲッター
    public BigDecimal getBalance() { return balance; }
    public List<Transaction> getTransactions() { return new ArrayList<>(transactions); }
}
```

## 6.2 単体テストの基本原則

### 6.2.1 良いテストの特徴:F.I.R.S.T原則

単体テストは以下の特徴を備えるべきである:

#### Fast(高速)

テストは迅速に実行されるべきである。開発者がテストを頻繁に実行することを妨げない速度でなければならない。

_[C#]_
```csharp
// 高速なテストの例
[Test]
public void CalculateDiscount_ValidInput_ReturnsCorrectDiscount()
{
    // Arrange - 準備が軽量
    var calculator = new DiscountCalculator();
   
    // Act - 実行が高速
    var result = calculator.CalculateDiscount(100m, CustomerType.Premium);
   
    // Assert - 検証が明確
    Assert.AreEqual(15m, result);
}

// 遅いテストの例(避けるべき)
[Test]
public void GetUser_DatabaseIntegration_ReturnsUser()
{
    // データベース接続、データ準備、クリーンアップが必要
    // 実行に数秒かかる可能性がある
}
```

#### Independent(独立)

各テストは他のテストに依存せず、任意の順序で実行できるべきである。

_[Python]_
```python
# 独立したテストの例
class TestShoppingCart:
    def test_add_item_increases_total(self):
        cart = ShoppingCart()  # 各テストで新しいインスタンス
        cart.add_item(Item("Book", 20.00))
        assert cart.total == 20.00
   
    def test_remove_item_decreases_total(self):
        cart = ShoppingCart()  # 独立したインスタンス
        cart.add_item(Item("Book", 20.00))
        cart.remove_item("Book")
        assert cart.total == 0.00
```

#### Repeatable(再現可能)

テストは任意の環境で同じ結果を得られるべきである。

_[JavaScript]_
```javascript
// 再現可能なテストの例
describe('DateUtils', () => {
    it('should format date consistently', () => {
        // 固定日時を使用して再現可能性を確保
        const fixedDate = new Date('2024-01-15T10:30:00Z');
        const result = DateUtils.formatDate(fixedDate);
        expect(result).toBe('2024-01-15');
    });
   
    // 現在時刻に依存する悪い例
    it('should return current year', () => {
        const result = DateUtils.getCurrentYear();
        expect(result).toBe(2024); // 来年には失敗する
    });
});
```

#### Self-Validating(自己検証)

テストの結果は明確にパス/フェイルで判定できるべきである。

_[C#]_
```csharp
// 自己検証の良い例
[Test]
public void ValidateEmail_InvalidFormat_ReturnsFalse()
{
    var validator = new EmailValidator();
    var result = validator.IsValid("invalid-email");
    Assert.IsFalse(result); // 明確な結果
}

// 悪い例:手動での結果確認が必要
[Test]
public void PrintUserInfo_ValidUser_PrintsInformation()
{
    var user = new User("John", "john@example.com");
    userService.PrintUserInfo(user); // 出力を目視確認する必要がある
}
```

#### Timely(適時)

テストは、本体コードの直前または直後に書かれるべきである。

### 6.2.2 テストの構造:AAA(Arrange-Act-Assert)パターン

_[C#]_
```csharp
[Test]
public void CalculateShippingCost_DomesticOrder_ReturnsStandardRate()
{
    // Arrange:テストの準備
    var calculator = new ShippingCalculator();
    var order = new Order
    {
        Weight = 2.5m,
        Destination = "Tokyo",
        IsInternational = false
    };
   
    // Act:テスト対象の実行
    var cost = calculator.CalculateShippingCost(order);
   
    // Assert:結果の検証
    Assert.AreEqual(500m, cost);
}
```

### 6.2.3 テストケースの設計原則

#### 境界値テスト

_[Python]_
```python
def test_grade_calculation_boundary_values():
    calculator = GradeCalculator()
   
    # 境界値をテスト
    assert calculator.get_letter_grade(89.9) == 'B'  # Aの直前
    assert calculator.get_letter_grade(90.0) == 'A'  # A の下限
    assert calculator.get_letter_grade(90.1) == 'A'  # A の直後
    assert calculator.get_letter_grade(100.0) == 'A' # 最大値
```

#### 等価クラステスト

_[Java]_
```java
@Test
public void validateAge_EquivalenceClasses() {
    AgeValidator validator = new AgeValidator();
   
    // 有効な値のクラス
    assertTrue(validator.isValid(25));  // 成人
    assertTrue(validator.isValid(65));  // 高齢者
   
    // 無効な値のクラス
    assertFalse(validator.isValid(-1));  // 負の値
    assertFalse(validator.isValid(0));   // ゼロ
    assertFalse(validator.isValid(150)); // 現実的でない値
}
```

## 6.3 テスト駆動開発(TDD)の実践

### 6.3.1 TDDの基本サイクル:Red-Green-Refactor

テスト駆動開発は以下の3つのステップを繰り返す:

![テスト駆動開発(TDD)サイクル](Images/tdd-cycle-flowchart.md)

1. **Red**:失敗するテストを書く
2. **Green**:テストを通す最小限のコードを書く
3. **Refactor**:コードを改善する

### 6.3.2 TDDの実践例:電卓クラスの開発

#### ステップ1:Red - 失敗するテストを書く

_[C#]_
```csharp
[Test]
public void Add_TwoPositiveNumbers_ReturnsSum()
{
    // Arrange
    var calculator = new Calculator();
   
    // Act
    var result = calculator.Add(2, 3);
   
    // Assert
    Assert.AreEqual(5, result);
}
```

この時点では`Calculator`クラスが存在しないため、コンパイルエラーとなる。

#### ステップ2:Green - 最小限の実装

_[C#]_
```csharp
public class Calculator
{
    public int Add(int a, int b)
    {
        return 5; // テストを通すための最小限の実装
    }
}
```

テストは通るが、実装は不完全である。

#### ステップ3:より多くのテストケース

_[C#]_
```csharp
[Test]
public void Add_DifferentNumbers_ReturnsCorrectSum()
{
    var calculator = new Calculator();
   
    Assert.AreEqual(5, calculator.Add(2, 3));
    Assert.AreEqual(7, calculator.Add(3, 4));
    Assert.AreEqual(0, calculator.Add(-1, 1));
}
```

#### ステップ4:適切な実装への改善

_[C#]_
```csharp
public class Calculator
{
    public int Add(int a, int b)
    {
        return a + b; // 汎用的な実装
    }
}
```

#### ステップ5:Refactor - より複雑な機能の追加

_[C#]_
```csharp
[Test]
public void Divide_ValidNumbers_ReturnsQuotient()
{
    var calculator = new Calculator();
    var result = calculator.Divide(10, 2);
    Assert.AreEqual(5, result);
}

[Test]
public void Divide_ByZero_ThrowsException()
{
    var calculator = new Calculator();
    Assert.Throws<DivideByZeroException>(() => calculator.Divide(10, 0));
}
```

_[C#]_
```csharp
public class Calculator
{
    public int Add(int a, int b)
    {
        return a + b;
    }
   
    public double Divide(double dividend, double divisor)
    {
        if (divisor == 0)
            throw new DivideByZeroException("Cannot divide by zero");
           
        return dividend / divisor;
    }
}
```

### 6.3.3 TDDの利点

#### 設計の改善

TDDを実践すると、自然とTestableな設計になる:

_[C#]_
```csharp
// TDDで開発された銀行口座クラス
public class BankAccount
{
    private decimal _balance;
    private readonly List<Transaction> _transactions;
   
    public BankAccount(decimal initialBalance = 0)
    {
        if (initialBalance < 0)
            throw new ArgumentException("Initial balance cannot be negative");
           
        _balance = initialBalance;
        _transactions = new List<Transaction>();
    }
   
    public decimal Balance => _balance;
    public IReadOnlyList<Transaction> Transactions => _transactions.AsReadOnly();
   
    public void Deposit(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Deposit amount must be positive");
           
        _balance += amount;
        _transactions.Add(new Transaction(TransactionType.Deposit, amount, DateTime.Now));
    }
   
    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Withdrawal amount must be positive");
           
        if (amount > _balance)
            throw new InvalidOperationException("Insufficient funds");
           
        _balance -= amount;
        _transactions.Add(new Transaction(TransactionType.Withdrawal, amount, DateTime.Now));
    }
}
```

このクラスは以下のようなテストによって開発された:

_[C#]_
```csharp
[Test]
public void Constructor_PositiveBalance_SetsBalance()
{
    var account = new BankAccount(100);
    Assert.AreEqual(100, account.Balance);
}

[Test]
public void Constructor_NegativeBalance_ThrowsException()
{
    Assert.Throws<ArgumentException>(() => new BankAccount(-50));
}

[Test]
public void Deposit_PositiveAmount_IncreasesBalance()
{
    var account = new BankAccount(100);
    account.Deposit(50);
    Assert.AreEqual(150, account.Balance);
}

[Test]
public void Withdraw_SufficientFunds_DecreasesBalance()
{
    var account = new BankAccount(100);
    account.Withdraw(30);
    Assert.AreEqual(70, account.Balance);
}

[Test]
public void Withdraw_InsufficientFunds_ThrowsException()
{
    var account = new BankAccount(50);
    Assert.Throws<InvalidOperationException>(() => account.Withdraw(100));
}
```

## 6.4 テストコードの品質向上

### 6.4.1 テストコードも美しくあるべき

テストコードは本体コードと同じように品質を保つべきである。美しいソースコードのための七箇条は、テストコードにも適用される。

#### 意図を表現するテストコード

_[C#]_
```csharp
// 悪い例:意図が不明確
[Test]
public void Test1()
{
    var x = new Calculator();
    var y = x.Add(2, 3);
    Assert.AreEqual(5, y);
}

// 良い例:意図が明確
[Test]
public void Add_TwoPositiveIntegers_ReturnsCorrectSum()
{
    // Given: 電卓と2つの正の整数
    var calculator = new Calculator();
    var firstNumber = 2;
    var secondNumber = 3;
    var expectedSum = 5;
   
    // When: 加算を実行
    var actualSum = calculator.Add(firstNumber, secondNumber);
   
    // Then: 正しい合計が返される
    Assert.AreEqual(expectedSum, actualSum);
}
```

#### テストコードの単一責務原則

_[Python]_
```python
# 悪い例:複数のことをテストしている
def test_user_operations():
    user = User("John", "john@example.com")
   
    # ユーザー作成のテスト
    assert user.name == "John"
    assert user.email == "john@example.com"
   
    # パスワード設定のテスト
    user.set_password("password123")
    assert user.check_password("password123")
   
    # プロフィール更新のテスト
    user.update_profile({"bio": "Software Developer"})
    assert user.profile["bio"] == "Software Developer"

# 良い例:単一の責務
def test_user_creation_with_valid_data():
    user = User("John", "john@example.com")
    assert user.name == "John"
    assert user.email == "john@example.com"

def test_password_setting_and_verification():
    user = User("John", "john@example.com")
    user.set_password("password123")
    assert user.check_password("password123")

def test_profile_update_sets_bio():
    user = User("John", "john@example.com")
    user.update_profile({"bio": "Software Developer"})
    assert user.profile["bio"] == "Software Developer"
```

### 6.4.2 テストデータの管理

#### ファクトリーパターンの活用

_[C#]_
```csharp
// テストデータファクトリー
public static class TestDataFactory
{
    public static User CreateValidUser(string name = "John Doe", string email = "john@example.com")
    {
        return new User(name, email);
    }
   
    public static Order CreateOrderWithItems(params Item[] items)
    {
        var order = new Order(CreateValidUser());
        foreach (var item in items)
        {
            order.AddItem(item);
        }
        return order;
    }
   
    public static Item CreateBook(string title = "Default Book", decimal price = 29.99m)
    {
        return new Item(title, price, ItemType.Book);
    }
}

// テストでの使用
[Test]
public void CalculateTotal_MultipleItems_ReturnsCorrectSum()
{
    var book1 = TestDataFactory.CreateBook("Book 1", 19.99m);
    var book2 = TestDataFactory.CreateBook("Book 2", 24.99m);
    var order = TestDataFactory.CreateOrderWithItems(book1, book2);
   
    var total = order.CalculateTotal();
   
    Assert.AreEqual(44.98m, total);
}
```

#### Builderパターンによる柔軟なテストデータ作成

_[Java]_
```java
// テストデータビルダー
public class UserTestBuilder {
    private String name = "Default Name";
    private String email = "default@example.com";
    private int age = 25;
    private boolean isActive = true;
   
    public UserTestBuilder withName(String name) {
        this.name = name;
        return this;
    }
   
    public UserTestBuilder withEmail(String email) {
        this.email = email;
        return this;
    }
   
    public UserTestBuilder withAge(int age) {
        this.age = age;
        return this;
    }
   
    public UserTestBuilder inactive() {
        this.isActive = false;
        return this;
    }
   
    public User build() {
        return new User(name, email, age, isActive);
    }
}

// テストでの使用
@Test
public void validateUser_InactiveUser_ReturnsFalse() {
    User user = new UserTestBuilder()
        .withName("John")
        .withEmail("john@example.com")
        .inactive()
        .build();
   
    UserValidator validator = new UserValidator();
    boolean isValid = validator.validate(user);
   
    assertFalse(isValid);
}
```

### 6.4.3 モックとスタブの効果的活用

#### モックの使用例

_[C#]_
```csharp
[Test]
public async Task ProcessOrder_PaymentSucceeds_SendsConfirmationEmail()
{
    // Arrange
    var mockPaymentService = new Mock<IPaymentService>();
    var mockEmailService = new Mock<IEmailService>();
    var mockOrderRepository = new Mock<IOrderRepository>();
   
    var order = new Order { Id = 1, CustomerEmail = "test@example.com", Amount = 100 };
    mockOrderRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);
    mockPaymentService.Setup(p => p.ProcessPaymentAsync(100))
                     .ReturnsAsync(PaymentResult.Success());
   
    var processor = new OrderProcessor(
        mockOrderRepository.Object,
        mockPaymentService.Object,
        mockEmailService.Object);
   
    // Act
    await processor.ProcessOrderAsync(1);
   
    // Assert
    mockEmailService.Verify(
        e => e.SendConfirmationEmailAsync("test@example.com", It.IsAny<OrderConfirmation>()),
        Times.Once);
}
```

#### スタブの使用例

_[Python]_
```python
# スタブクラスの実装
class StubEmailService:
    def __init__(self):
        self.sent_emails = []
   
    def send_email(self, to, subject, body):
        self.sent_emails.append({
            'to': to,
            'subject': subject,
            'body': body
        })
        return True  # 常に成功を返す

# テストでの使用
def test_user_registration_sends_welcome_email():
    email_service = StubEmailService()
    user_service = UserService(email_service)
   
    user_service.register_user("john@example.com", "password123")
   
    assert len(email_service.sent_emails) == 1
    assert email_service.sent_emails[0]['to'] == "john@example.com"
    assert "Welcome" in email_service.sent_emails[0]['subject']
```

## 6.5 実践演習:TDDによる開発

### 6.5.1 演習課題:図書館管理システム

以下の要件に従って、TDDで図書館管理システムの一部を開発してみよう。

#### 要件
1. 書籍には以下の情報がある:ISBN、タイトル、著者、貸出状況
2. 書籍は貸出、返却ができる
3. 既に貸出中の書籍は貸出できない
4. 存在しない書籍は操作できない
5. 利用者は複数の書籍を借りることができる
6. 利用者は貸出中の書籍一覧を確認できる

#### ステップ1:書籍クラスのテスト

_[C#]_
```csharp
[Test]
public void Book_Constructor_SetsPropertiesCorrectly()
{
    // Arrange & Act
    var book = new Book("978-4-12-345678-9", "Clean Code", "Robert C. Martin");
   
    // Assert
    Assert.AreEqual("978-4-12-345678-9", book.ISBN);
    Assert.AreEqual("Clean Code", book.Title);
    Assert.AreEqual("Robert C. Martin", book.Author);
    Assert.IsFalse(book.IsCheckedOut);
}

[Test]
public void CheckOut_AvailableBook_MarksAsCheckedOut()
{
    // Arrange
    var book = new Book("978-4-12-345678-9", "Clean Code", "Robert C. Martin");
   
    // Act
    var result = book.CheckOut();
   
    // Assert
    Assert.IsTrue(result);
    Assert.IsTrue(book.IsCheckedOut);
}

[Test]
public void CheckOut_AlreadyCheckedOutBook_ReturnsFalse()
{
    // Arrange
    var book = new Book("978-4-12-345678-9", "Clean Code", "Robert C. Martin");
    book.CheckOut(); // 既に貸出済み
   
    // Act
    var result = book.CheckOut();
   
    // Assert
    Assert.IsFalse(result);
    Assert.IsTrue(book.IsCheckedOut); // 状態は変わらない
}

[Test]
public void Return_CheckedOutBook_MarksAsAvailable()
{
    // Arrange
    var book = new Book("978-4-12-345678-9", "Clean Code", "Robert C. Martin");
    book.CheckOut();
   
    // Act
    var result = book.Return();
   
    // Assert
    Assert.IsTrue(result);
    Assert.IsFalse(book.IsCheckedOut);
}
```

#### ステップ2:実装

_[C#]_
```csharp
public class Book
{
    public string ISBN { get; }
    public string Title { get; }
    public string Author { get; }
    public bool IsCheckedOut { get; private set; }
   
    public Book(string isbn, string title, string author)
    {
        ISBN = isbn ?? throw new ArgumentNullException(nameof(isbn));
        Title = title ?? throw new ArgumentNullException(nameof(title));
        Author = author ?? throw new ArgumentNullException(nameof(author));
        IsCheckedOut = false;
    }
   
    public bool CheckOut()
    {
        if (IsCheckedOut)
            return false;
           
        IsCheckedOut = true;
        return true;
    }
   
    public bool Return()
    {
        if (!IsCheckedOut)
            return false;
           
        IsCheckedOut = false;
        return true;
    }
}
```

#### ステップ3:図書館クラスのテスト

_[C#]_
```csharp
[Test]
public void AddBook_ValidBook_AddsToCollection()
{
    // Arrange
    var library = new Library();
    var book = new Book("978-4-12-345678-9", "Clean Code", "Robert C. Martin");
   
    // Act
    library.AddBook(book);
   
    // Assert
    var foundBook = library.FindBook("978-4-12-345678-9");
    Assert.IsNotNull(foundBook);
    Assert.AreEqual("Clean Code", foundBook.Title);
}

[Test]
public void CheckOutBook_ExistingAvailableBook_ReturnsTrue()
{
    // Arrange
    var library = new Library();
    var book = new Book("978-4-12-345678-9", "Clean Code", "Robert C. Martin");
    library.AddBook(book);
   
    // Act
    var result = library.CheckOutBook("978-4-12-345678-9");
   
    // Assert
    Assert.IsTrue(result);
    Assert.IsTrue(book.IsCheckedOut);
}

[Test]
public void CheckOutBook_NonExistentBook_ReturnsFalse()
{
    // Arrange
    var library = new Library();
   
    // Act
    var result = library.CheckOutBook("978-4-12-345678-9");
   
    // Assert
    Assert.IsFalse(result);
}
```

#### ステップ4:図書館クラスの実装

_[C#]_
```csharp
public class Library
{
    private readonly Dictionary<string, Book> _books;
   
    public Library()
    {
        _books = new Dictionary<string, Book>();
    }
   
    public void AddBook(Book book)
    {
        if (book == null)
            throw new ArgumentNullException(nameof(book));
           
        _books[book.ISBN] = book;
    }
   
    public Book FindBook(string isbn)
    {
        _books.TryGetValue(isbn, out var book);
        return book;
    }
   
    public bool CheckOutBook(string isbn)
    {
        var book = FindBook(isbn);
        return book?.CheckOut() ?? false;
    }
   
    public bool ReturnBook(string isbn)
    {
        var book = FindBook(isbn);
        return book?.Return() ?? false;
    }
   
    public IEnumerable<Book> GetAvailableBooks()
    {
        return _books.Values.Where(b => !b.IsCheckedOut);
    }
   
    public IEnumerable<Book> GetCheckedOutBooks()
    {
        return _books.Values.Where(b => b.IsCheckedOut);
    }
}
```

### 6.5.2 演習のポイント

#### TDDサイクルの実践
1. **Red**: 失敗するテストを先に書く
2. **Green**: テストを通すための最小限の実装
3. **Refactor**: コードの改善

#### 設計の自然な改善
TDDを実践することで、以下の設計改善が自然に生まれる:
- **カプセル化**: 状態変更は適切なメソッドを通して行う
- **単一責務**: 各クラスが明確な責務を持つ
- **Testability**: 依存関係が明確で、テストしやすい構造

#### より高度な要求への対応

利用者管理機能を追加する場合:

_[C#]_
```csharp
[Test]
public void CheckOutBook_ToMember_RecordsTransaction()
{
    // Arrange
    var library = new Library();
    var book = new Book("978-4-12-345678-9", "Clean Code", "Robert C. Martin");
    var member = new Member("M001", "John Doe");
    library.AddBook(book);
    library.RegisterMember(member);
   
    // Act
    var result = library.CheckOutBook("978-4-12-345678-9", "M001");
   
    // Assert
    Assert.IsTrue(result);
    Assert.Contains(book, member.CheckedOutBooks);
}
```

このテストによって、`Member`クラスの必要性と`Library`クラスの機能拡張が明確になる。

### 6.5.3 演習の発展課題

1. **貸出期限の管理**: 書籍に貸出日と返却期限を追加
2. **延滞料金の計算**: 期限切れの書籍に対する料金計算
3. **予約システム**: 貸出中の書籍の予約機能
4. **在庫管理**: 同じ書籍の複数冊管理

これらの機能を追加する際も、必ずテストファーストで進めることで、品質の高い設計を維持できる。

---

**章末まとめ**

第6章では、Testableな設計の重要性から始まり、単体テストの基本原則、テスト駆動開発の実践方法、そしてテストコードの品質向上について学んだ。

美しいソースコードのための七箇条の最後に位置する「Testable」は、単なるテスト可能性を超えて、コードの品質全体に影響を与える重要な特性である。TDDを実践することで、自然と高品質な設計が生まれ、変更に強く、理解しやすいコードが書けるようになる。

次章では、コードの継続的改善であるリファクタリングについて詳しく学んでいく。テストがあることで、安心してリファクタリングを行うことができるのである。

---

**[← 目次に戻る](目次.md)**