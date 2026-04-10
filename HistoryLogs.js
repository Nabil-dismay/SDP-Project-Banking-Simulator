// create account object
const account = {
  owner: "Alice",
  balance: 0,
  history: [] // store all actions here
};

// function to add log
function addLog(type, amount, note) {
  const log = {
    type: type,       // action type
    amount: amount,   // money value
    note: note,       // extra info
    date: new Date().toLocaleString() // readable time
  };

  account.history.push(log); // save log
}

// deposit money
function deposit(amount) {
  account.balance += amount; // add money
  addLog("DEPOSIT", amount, "Added money");
}

// withdraw money
function withdraw(amount) {
  if (amount > account.balance) {
    console.log("Not enough money");
    return;
  }

  account.balance -= amount; // remove money
  addLog("WITHDRAW", amount, "Took money");
}

// transfer money
function transfer(amount, targetName) {
  if (amount > account.balance) {
    console.log("Not enough money");
    return;
  }

  account.balance -= amount; // remove money
  addLog("TRANSFER", amount, "Sent to " + targetName);
}