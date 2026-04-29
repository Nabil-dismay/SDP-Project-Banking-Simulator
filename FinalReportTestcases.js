const { generateReport } = require("./FinalReport");

let account;

// reset helper
function resetAccount(data) {
  account = {
    owner: data.owner,
    balance: data.balance,
    history: data.history
  };

  global.account = account; // <-- important
}

// TESTS

resetAccount({
  owner: "Alice",
  balance: 1000,
  history: [
    { type: "DEPOSIT", amount: 500 },
    { type: "WITHDRAW", amount: 200 },
    { type: "TRANSFER", amount: 300 }
  ]
});
generateReport();

resetAccount({
  owner: "Charlie",
  balance: 0,
  history: []
});
generateReport();

resetAccount({
  owner: "Dana",
  balance: 500,
  history: [
    { type: "DEPOSIT", amount: 200 },
    { type: "BONUS", amount: 100 }
  ]
});
generateReport();