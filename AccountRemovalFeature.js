
// MODEL


class Account {
  constructor(id, userId, balance, status, closedAt = null) {
    this.id = id;
    this.userId = userId;
    this.balance = balance;
    this.status = status; // ACTIVE, CLOSED
    this.closedAt = closedAt;
  }
}


//  REPOSITORY (in-memory)


class AccountRepository {
  constructor() {
    this.accounts = new Map();
  }

  findById(id) {
    return this.accounts.get(id) || null;
  }

  save(account) {
    this.accounts.set(account.id, account);
    return account;
  }

  clear() {
    this.accounts.clear();
  }
}

// singleton instance
const accountRepository = new AccountRepository();


// EXCEPTIONS


class BadRequestException extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class ResourceNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}


// ⚙️ SERVICE (CORE LOGIC)


class AccountService {

  removeAccount(userId, accountId) {

    // ✅ Null validation (EH5, EH6)
    if (userId == null || accountId == null) {
      throw new Error("Invalid input");
    }

    const account = accountRepository.findById(accountId);

    // EH1
    if (!account) {
      throw new ResourceNotFoundException("Account not found");
    }

    // EH2
    if (account.userId !== userId) {
      throw new BadRequestException("Unauthorized action");
    }

    // EC2 + EH3
    if (account.status === "CLOSED") {
      throw new BadRequestException("Account already closed");
    }

    // EH4
    if (account.balance !== 0) {
      throw new BadRequestException("Account balance must be zero");
    }

    // TC1, TC4, TC5
    account.status = "CLOSED";
    account.closedAt = new Date();

    accountRepository.save(account);
  }
}

// singleton service
const accountService = new AccountService();


// EXPORTS (so tests can use it)


module.exports = {
  Account,
  accountRepository,
  accountService,
  BadRequestException,
  ResourceNotFoundException
};