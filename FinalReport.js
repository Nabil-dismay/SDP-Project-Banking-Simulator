const { account } = require("./HistoryLogs");

function generateReport() {
  if (!account || !account.history) {
    console.log("Invalid account");
    return;
  }

  let totalDeposit = 0;
  let totalWithdraw = 0;
  let totalTransfer = 0;

  for (let tx of account.history) {
    if (!tx.amount) continue;

    if (tx.type === "DEPOSIT") totalDeposit += tx.amount;
    if (tx.type === "WITHDRAW") totalWithdraw += tx.amount;
    if (tx.type === "TRANSFER") totalTransfer += tx.amount;
  }

  console.log("---- FINAL REPORT ----");
  console.log("Owner:", account.owner);
  console.log("Balance:", account.balance);
  console.log("Total Deposited:", totalDeposit);
  console.log("Total Withdrawn:", totalWithdraw);
  console.log("Total Transferred:", totalTransfer);
}

module.exports = { generateReport };