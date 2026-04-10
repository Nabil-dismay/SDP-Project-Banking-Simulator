function generateReport() {
  let totalDeposit = 0;
  let totalWithdraw = 0;
  let totalTransfer = 0;

  // go through all logs
  for (let i = 0; i < account.history.length; i++) {
    let tx = account.history[i];

    if (tx.type === "DEPOSIT") {
      totalDeposit += tx.amount;
    }

    if (tx.type === "WITHDRAW") {
      totalWithdraw += tx.amount;
    }

    if (tx.type === "TRANSFER") {
      totalTransfer += tx.amount;
    }
  }

  // print report
  console.log("---- FINAL REPORT ----");
  console.log("Owner:", account.owner);
  console.log("Balance:", account.balance);
  console.log("Total Deposited:", totalDeposit);
  console.log("Total Withdrawn:", totalWithdraw);
  console.log("Total Transferred:", totalTransfer);
  console.log("All Logs:", account.history);
}