deposit(100);

deposit(50);
deposit(150);

deposit(0);

deposit(-100);

deposit(200);
withdraw(100);

withdraw(100);

withdraw(50);

withdraw(-50);

deposit(300);
transfer(100, "Bob");

transfer(500, "Bob");

transfer(-100, "Bob");

deposit(100);
withdraw(50);
transfer(20, "Bob");

deposit(1_000_000);

transfer(50, "");

function resetAccount() {
  account.balance = 0;
  account.history = [];
}

// Example test
resetAccount();
deposit(100);

console.assert(account.balance === 100, "Deposit failed");
console.assert(account.history.length === 1, "Log not added");