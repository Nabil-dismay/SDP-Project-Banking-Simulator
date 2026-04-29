const { account, deposit, withdraw, transfer } = require("./HistoryLogs");

// reset helper
function resetAccount() {
  account.balance = 0;
  account.history = [];
}

// TESTS

resetAccount();
deposit(100);
console.assert(account.balance === 100, "Deposit failed");

resetAccount();
deposit(200);
withdraw(100);
console.assert(account.balance === 100, "Withdraw failed");

resetAccount();
deposit(300);
transfer(100, "Bob");
console.assert(account.balance === 200, "Transfer failed");

console.log("HistoryLogs tests passed ✅");