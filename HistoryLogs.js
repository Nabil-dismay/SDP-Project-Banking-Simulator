const account = {
  owner: "Alice",
  balance: 0,
  history: []
};

function addLog(type, amount, note) {
  account.history.push({
    type,
    amount,
    note,
    date: new Date().toLocaleString()
  });
}

function deposit(amount) {
  account.balance += amount;
  addLog("DEPOSIT", amount, "Added money");
}

function withdraw(amount) {
  if (amount > account.balance) {
    console.log("Not enough money");
    return;
  }
  account.balance -= amount;
  addLog("WITHDRAW", amount, "Took money");
}

function transfer(amount, targetName) {
  if (amount > account.balance) {
    console.log("Not enough money");
    return;
  }
  account.balance -= amount;
  addLog("TRANSFER", amount, "Sent to " + targetName);
}

// ✅ THIS PART IS CRITICAL
module.exports = {
  account,
  deposit,
  withdraw,
  transfer
};