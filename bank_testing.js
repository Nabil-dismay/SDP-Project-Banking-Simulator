// banking.js

export const state = {
    accounts: []
};

// --------------------
// HELPERS
// --------------------
function findAccount(id) {
    return state.accounts.find(a => a.id === id);
}

// --------------------
// CORE FUNCTIONS
// --------------------
export function addAccount(name) {
    const newAcc = {
        id: Date.now().toString(),
        name,
        balance: 0
    };

    state.accounts.push(newAcc);
    return newAcc;
}

export function deleteAccount(id) {
    state.accounts = state.accounts.filter(acc => acc.id !== id);
}

export function deposit(accountId, amount) {
    if (!accountId || amount <= 0 || isNaN(amount)) {
        throw new Error("Invalid deposit");
    }

    const acc = findAccount(accountId);
    if (!acc) throw new Error("Account not found");

    acc.balance += amount;
    return acc.balance;
}

export function withdraw(accountId, amount) {
    if (!accountId || amount <= 0 || isNaN(amount)) {
        throw new Error("Invalid withdraw");
    }

    const acc = findAccount(accountId);
    if (!acc) throw new Error("Account not found");

    if (acc.balance < amount) {
        throw new Error("Insufficient funds");
    }

    acc.balance -= amount;
    return acc.balance;
}

export function transfer(fromId, toId, amount) {
    if (!fromId || !toId || amount <= 0) {
        throw new Error("Invalid transfer");
    }

    const from = findAccount(fromId);
    const to = findAccount(toId);

    if (!from || !to) throw new Error("Account not found");
    if (from.balance < amount) throw new Error("Insufficient funds");

    from.balance -= amount;
    to.balance += amount;

    return { from: from.balance, to: to.balance };
}

export function getTotalBalance() {
    return state.accounts.reduce((sum, a) => sum + a.balance, 0);
}