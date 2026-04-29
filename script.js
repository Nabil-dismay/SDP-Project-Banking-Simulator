// Global state
export let state = {
    accounts: [],
    nextId: 1
};

// Reset state before each test
export function resetState() {
    state.accounts = [];
    state.nextId = 1;
}

// Add a new account
export function addAccount(name) {
    const account = {
        id: state.nextId++,
        name,
        balance: 0
    };

    state.accounts.push(account);
    return account; // IMPORTANT: return the same reference
}

// Helper to find account
function findAccount(id) {
    return state.accounts.find(acc => acc.id === id);
}

// Deposit money
export function deposit(id, amount) {
    const acc = findAccount(id);
    acc.balance += amount;
}

// Withdraw money
export function withdraw(id, amount) {
    const acc = findAccount(id);
    acc.balance -= amount;
}

// Transfer money
export function transfer(fromId, toId, amount) {
    const fromAcc = findAccount(fromId);
    const toAcc = findAccount(toId);

    fromAcc.balance -= amount;
    toAcc.balance += amount;

    return {
        from: fromAcc.balance,
        to: toAcc.balance
    };
}

// Get total balance of all accounts
export function getTotalBalance() {
    return state.accounts.reduce((sum, acc) => sum + acc.balance, 0);
}
