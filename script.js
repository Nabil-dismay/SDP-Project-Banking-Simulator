let accounts = [];

// Selectors
const accountListContainer = document.querySelector('.accounts-list');
const addAccountBtn = document.querySelector('.accounts-card .btn.small');
const fromSelect = document.querySelectorAll('select')[0];
const toSelect = document.querySelectorAll('select')[1];
const amountInput = document.querySelector("input[type='number']");
const simulateBtn = document.querySelector(".form-actions .btn.primary");
const balanceDisplay = document.querySelector('.summary-value');

// -----------------------------
// RENDER
// -----------------------------
function renderAccounts() {
    accountListContainer.innerHTML = '';

    if (accounts.length === 0) {
        accountListContainer.innerHTML = '<p class="empty-state">No accounts created yet.</p>';
        return;
    }

    accounts.forEach((acc, index) => {
        const accDiv = document.createElement('div');
        accDiv.className = 'account-item';
        accDiv.style.cssText = 'display:flex; justify-content:space-between; padding:10px; border:1px solid var(--border); margin-bottom:8px;';
        
        accDiv.innerHTML = `
            <div>
                <div>${acc.name}</div>
                <div>${acc.type || ''}</div>
            </div>
            <div style="display:flex; gap:10px;">
                <span>€${acc.balance.toFixed(2)}</span>
                <button class="delete-btn" data-id="${acc.id}">✕</button>
            </div>
        `;
        accountListContainer.appendChild(accDiv);
    });

    updateDropdowns();
    updateTotalBalance();
}

// -----------------------------
function updateDropdowns() {
    const options = accounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('');
    fromSelect.innerHTML = '<option value="">Select</option>' + options;
    toSelect.innerHTML = '<option value="">Select</option>' + options;
}

// -----------------------------
function updateTotalBalance() {
    const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    balanceDisplay.textContent = `€${total.toFixed(2)}`;
}

// -----------------------------
// ADD ACCOUNT
// -----------------------------
addAccountBtn.addEventListener('click', () => {
    const name = prompt("Account name:");
    if (!name) return;

    const newAcc = {
        id: Date.now().toString(),
        name: name,
        balance: 0
    };

    accounts.push(newAcc);
    renderAccounts();
});

// -----------------------------
// DELETE
// -----------------------------
accountListContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = e.target.getAttribute("data-id");
        accounts = accounts.filter(acc => acc.id != id);
        renderAccounts();
    }
});

// -----------------------------
// SIMULATE (Deposit / Withdraw / Transfer)
// -----------------------------
simulateBtn.addEventListener("click", () => {
    const fromId = fromSelect.value;
    const toId = toSelect.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
    }

    // DEPOSIT (no to account)
    if (fromId && !toId) {
        const acc = accounts.find(a => a.id == fromId);
        acc.balance += amount;
        renderAccounts();
        alert("Deposit successful!");
        return;
    }

    // WITHDRAW (same account selected)
    if (fromId && fromId === toId) {
        const acc = accounts.find(a => a.id == fromId);
        if (acc.balance < amount) {
            alert("Insufficient funds");
            return;
        }
        acc.balance -= amount;
        renderAccounts();
        alert("Withdraw successful!");
        return;
    }

    // TRANSFER
    if (fromId && toId && fromId !== toId) {
        fetch('/api/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from_account: fromId,
                to_account: toId,
                amount: amount
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            const fromAcc = accounts.find(a => a.id == fromId);
            const toAcc = accounts.find(a => a.id == toId);

            fromAcc.balance -= amount;
            toAcc.balance += amount;

            renderAccounts();
            alert("Transfer successful!");
        });
    }
});

// -----------------------------
renderAccounts();