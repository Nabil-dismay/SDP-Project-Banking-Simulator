import {
    state,
    addAccount,
    deposit,
    withdraw,
    transfer,
    getTotalBalance,
    resetState
} from "./script.js";

beforeEach(() => {
    resetState();
});

test("addAccount works", () => {
    const acc = addAccount("John");

    expect(acc.name).toBe("John");
    expect(acc.balance).toBe(0);
});

test("deposit works", () => {
    const acc = addAccount("John");

    deposit(acc.id, 100);

    expect(acc.balance).toBe(100);
});

test("withdraw works", () => {
    const acc = addAccount("John");

    deposit(acc.id, 100);
    withdraw(acc.id, 40);

    expect(acc.balance).toBe(60);
});

test("transfer works", () => {
    const a = addAccount("A");
    const b = addAccount("B");

    deposit(a.id, 100);

    const result = transfer(a.id, b.id, 30);

    expect(result.from).toBe(70);
    expect(result.to).toBe(30);

    expect(getTotalBalance()).toBe(100);
});

test("total balance works", () => {
    const a = addAccount("A");
    const b = addAccount("B");

    deposit(a.id, 100);
    deposit(b.id, 50);

    expect(getTotalBalance()).toBe(150);
});