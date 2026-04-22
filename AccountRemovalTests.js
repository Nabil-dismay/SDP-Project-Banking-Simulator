// must be split first!! class/file 

const service = require("./src/services/AccountService");
const repository = require("./src/repositories/AccountRepository");

function createAccount(id, userId, balance, status) {
  return {
    id,
    userId,
    balance,
    status,
    closedAt: null
  };
}

function resetRepo() {
  repository.accounts.clear();
}

/*

FUNCTIONAL TEST CASES

*/

// TC1, TC4, TC5
test("TC1: should close account successfully", () => {
  resetRepo();

  repository.save(createAccount(10, 1, 0, "ACTIVE"));

  service.removeAccount(1, 10);

  const acc = repository.findById(10);

  expect(acc.status).toBe("CLOSED");
  expect(acc.closedAt).not.toBeNull();
});

// TC2 (API not tested here — service level only)

// TC3
test("TC3: should retrieve account from repository", () => {
  resetRepo();

  repository.save(createAccount(20, 2, 0, "ACTIVE"));

  service.removeAccount(2, 20);

  const acc = repository.findById(20);

  expect(acc).toBeDefined();
});

// TC4
test("TC4: status changes from ACTIVE to CLOSED", () => {
  resetRepo();

  repository.save(createAccount(30, 3, 0, "ACTIVE"));

  service.removeAccount(3, 30);

  const acc = repository.findById(30);

  expect(acc.status).toBe("CLOSED");
});

// TC5
test("TC5: closedAt is set", () => {
  resetRepo();

  repository.save(createAccount(40, 4, 0, "ACTIVE"));

  service.removeAccount(4, 40);

  const acc = repository.findById(40);

  expect(acc.closedAt).not.toBeNull();
});

/*

EDGE CASES

*/

// EC1
test("EC1: balance = 0 should close account", () => {
  resetRepo();

  repository.save(createAccount(11, 1, 0, "ACTIVE"));

  service.removeAccount(1, 11);

  const acc = repository.findById(11);

  expect(acc.status).toBe("CLOSED");
});

// EC2
test("EC2: already closed account should throw", () => {
  resetRepo();

  repository.save(createAccount(12, 1, 0, "CLOSED"));

  expect(() => service.removeAccount(1, 12))
    .toThrow("Account already closed");
});

// EC3
test("EC3: closedAt becomes non-null", () => {
  resetRepo();

  repository.save(createAccount(13, 1, 0, "ACTIVE"));

  service.removeAccount(1, 13);

  const acc = repository.findById(13);

  expect(acc.closedAt).not.toBeNull();
});

// EC4
test("EC4: large IDs handled correctly", () => {
  resetRepo();

  repository.save(createAccount(999999, 999999, 0, "ACTIVE"));

  service.removeAccount(999999, 999999);

  const acc = repository.findById(999999);

  expect(acc.status).toBe("CLOSED");
});

/*

ERROR HANDLING

*/

// EH1
test("EH1: account does not exist", () => {
  resetRepo();

  expect(() => service.removeAccount(1, 999))
    .toThrow("Account not found");
});

// EH2
test("EH2: unauthorized user", () => {
  resetRepo();

  repository.save(createAccount(10, 1, 0, "ACTIVE"));

  expect(() => service.removeAccount(2, 10))
    .toThrow("Unauthorized action");
});

// EH3
test("EH3: already closed", () => {
  resetRepo();

  repository.save(createAccount(14, 1, 0, "CLOSED"));

  expect(() => service.removeAccount(1, 14))
    .toThrow("Account already closed");
});

// EH4
test("EH4: balance not zero", () => {
  resetRepo();

  repository.save(createAccount(15, 1, 100, "ACTIVE"));

  expect(() => service.removeAccount(1, 15))
    .toThrow("Account balance must be zero");
});

// EH5
test("EH5: userId is null", () => {
  resetRepo();

  repository.save(createAccount(10, 1, 0, "ACTIVE"));

  expect(() => service.removeAccount(null, 10))
    .toThrow();
});

// EH6
test("EH6: accountId is null", () => {
  resetRepo();

  expect(() => service.removeAccount(1, null))
    .toThrow();
});

// EH7 (simulate unexpected error)
test("EH7: unexpected system error", () => {
  resetRepo();

  // break repository intentionally
  const original = repository.findById;
  repository.findById = () => {
    throw new Error("DB crash");
  };

  expect(() => service.removeAccount(1, 10))
    .toThrow();

  repository.findById = original; // restore
});