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

