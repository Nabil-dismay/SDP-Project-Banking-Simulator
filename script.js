// -----------------------------
// STATE (your accounts)
// -----------------------------
let accounts = [
  { name: "Account 1", balance: 0 },
  { name: "Account 2", balance: 0 }
];

// -----------------------------
// CONSTS (DOM)
// -----------------------------
const fromSelect = document.querySelectorAll("select")[0];
const amountInput = document.querySelector("input[type='number']");
const simulateBtn = document.querySelector(".form-actions .btn.primary");
const totalBalanceEl = document.querySelector(".summary-card .summary-value");

// -----------------------------
// UPDATE TOTAL BALANCE
// -----------------------------
function updateTotalBalance() {
  const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  totalBalanceEl.textContent = `€${total.toFixed(2)}`;
}

// -----------------------------
// DEPOSIT FEATURE
// -----------------------------
simulateBtn.addEventListener("click", () => {
  const accIndex = fromSelect.value;
  const amount = parseFloat(amountInput.value);

  // Validation
  if (accIndex === "" || isNaN(amount) || amount <= 0) {
    alert("Invalid input");
    return;
  }

  // Deposit
  accounts[accIndex].balance += amount;

  // Update UI
  updateTotalBalance();

  alert("Deposit successful!");
});