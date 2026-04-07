let accounts = [];

// 2. Selectors
const accountListContainer = document.querySelector('.accounts-list');
const addAccountBtn = document.querySelector('.accounts-card .btn.small');
const fromSelect = document.querySelectorAll('select')[0];
const toSelect = document.querySelectorAll('select')[1];
const balanceDisplay = document.querySelector('.summary-value');

function renderAccounts() {
    // Clear current list
    accountListContainer.innerHTML = '';

    if (accounts.length === 0) {
        accountListContainer.innerHTML = '<p class="empty-state">No accounts created yet.</p>';
        return;
    }

    accounts.forEach((acc, index) => {
        const accDiv = document.createElement('div');
        accDiv.className = 'account-item';
        accDiv.style.cssText = 'display:flex; justify-content:space-between; padding:10px; background:var(--bg-soft); border-radius:10px; margin-bottom:8px; border:1px solid var(--border);';
        
        accDiv.innerHTML = `
            <div>
                <div style="font-weight:600; font-size:14px;">${acc.name}</div>
                <div style="font-size:12px; color:var(--text-muted);">${acc.type}</div>
            </div>
            <div style="font-weight:600; color:var(--accent2);">€${acc.balance.toFixed(2)}</div>
        `;
        accountListContainer.appendChild(accDiv);
    });

    updateDropdowns();
    updateTotalBalance();
}

function updateDropdowns() {
    const options = accounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('');
    const placeholder = '<option value="">Select</option>';
    
    fromSelect.innerHTML = placeholder + options;
    toSelect.innerHTML = placeholder + options;
}


function updateTotalBalance() {
    const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    balanceDisplay.textContent = `€${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}


addAccountBtn.addEventListener('click', () => {
    // Simple prompt for the simulator
    const name = prompt("Enter Account Name (e.g., Main Savings):");
    if (!name) return;

    const type = prompt("Enter Account Type (Checking, Savings, Credit):", "Checking");
    const initialBalance = parseFloat(prompt("Initial Balance (€):", "0"));

    const newAccount = {
        id: Date.now(),
        name: name,
        type: type || 'General',
        balance: isNaN(initialBalance) ? 0 : initialBalance
    };

    accounts.push(newAccount);
    renderAccounts();
});

renderAccounts();
