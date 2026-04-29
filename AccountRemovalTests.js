const {
  Account,
  accountRepository,
  accountService
} = require("./AccountRemovalFeature");

function createAccount(id, userId, balance, status) {
  return new Account(id, userId, balance, status);
}

function resetRepo() {
  accountRepository.clear();
}

// TEST

resetRepo();

accountRepository.save(createAccount(10, 1, 0, "ACTIVE"));

accountService.removeAccount(1, 10);

const acc = accountRepository.findById(10);

console.assert(acc.status === "CLOSED", "Account not closed");
console.assert(acc.closedAt !== null, "closedAt not set");