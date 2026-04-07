# app.py
from flask import Flask, render_template, request, jsonify, session
import uuid
from datetime import datetime
import json

app = Flask(__name__)
app.secret_key = 'banking-simulator-secret-key-2024'

# Helper functions
def get_accounts_from_session():
    """Get accounts from session or initialize empty dict"""
    if 'accounts' not in session:
        session['accounts'] = {}
    return session['accounts']

def get_transactions_from_session():
    """Get transactions from session or initialize empty list"""
    if 'transactions' not in session:
        session['transactions'] = []
    return session['transactions']

def calculate_total_balance(accounts):
    """Calculate total balance across all accounts"""
    return sum(acc.get('balance', 0) for acc in accounts.values())

def calculate_credit_score(accounts, transactions):
    """Calculate credit score based on accounts and transaction history"""
    if not accounts:
        return 0
    
    total_balance = calculate_total_balance(accounts)
    num_accounts = len(accounts)
    num_transactions = len(transactions)
    
    # Simple scoring algorithm
    score = 300  # Base score
    
    # Balance contribution (max 300 points)
    if total_balance > 0:
        balance_score = min(300, int(total_balance / 100))
        score += balance_score
    
    # Account diversity (max 100 points)
    account_types = set(acc.get('type', 'checking') for acc in accounts.values())
    score += min(100, len(account_types) * 25)
    
    # Transaction history (max 150 points)
    score += min(150, num_transactions * 5)
    
    return min(850, score)

def calculate_monthly_cash_flow(transactions):
    """Calculate monthly cash flow from recent transactions"""
    # For demo, calculate total outflow from last 20 transactions
    total_out = 0
    for tx in transactions[:20]:  # Last 20 transactions
        if tx.get('type') == 'transfer' and tx.get('amount', 0) > 0:
            total_out += tx['amount']
    return total_out

def determine_risk_level(accounts, transactions):
    """Determine risk level based on account health"""
    if not accounts:
        return "None"
    
    total_balance = calculate_total_balance(accounts)
    
    if total_balance < 0:
        return "Critical"
    elif total_balance < 500:
        return "High"
    elif total_balance < 5000:
        return "Medium"
    else:
        return "Low"

@app.route('/')
def index():
    """Render the main banking simulator page"""
    return render_template('index.html')

@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    """Get all accounts"""
    accounts = get_accounts_from_session()
    accounts_list = [
        {
            'id': acc_id,
            'name': acc['name'],
            'type': acc.get('type', 'checking'),
            'balance': acc['balance'],
            'created_at': acc.get('created_at', '')
        }
        for acc_id, acc in accounts.items()
    ]
    return jsonify(accounts_list)

@app.route('/api/accounts', methods=['POST'])
def create_account():
    """Create a new account"""
    data = request.json
    account_name = data.get('name', 'New Account')
    account_type = data.get('type', 'checking')
    initial_balance = float(data.get('initial_balance', 0))
    
    accounts = get_accounts_from_session()
    account_id = str(uuid.uuid4())[:8]
    
    new_account = {
        'id': account_id,
        'name': account_name,
        'type': account_type,
        'balance': initial_balance,
        'created_at': datetime.now().isoformat()
    }
    
    accounts[account_id] = new_account
    session['accounts'] = accounts
    session.modified = True
    
    # Add initial deposit as transaction if balance > 0
    if initial_balance > 0:
        transactions = get_transactions_from_session()
        transactions.insert(0, {
            'id': str(uuid.uuid4())[:8],
            'type': 'deposit',
            'account_id': account_id,
            'account_name': account_name,
            'amount': initial_balance,
            'note': 'Initial deposit',
            'timestamp': datetime.now().isoformat(),
            'status': 'completed'
        })
        session['transactions'] = transactions[:100]  # Keep last 100
        session.modified = True
    
    return jsonify(new_account), 201

@app.route('/api/accounts/<account_id>', methods=['DELETE'])
def delete_account(account_id):
    """Delete an account"""
    accounts = get_accounts_from_session()
    if account_id in accounts:
        del accounts[account_id]
        session['accounts'] = accounts
        session.modified = True
        return jsonify({'success': True, 'message': 'Account deleted successfully'})
    return jsonify({'error': 'Account not found'}), 404

@app.route('/api/transfer', methods=['POST'])
def simulate_transfer():
    """Simulate a transfer between accounts"""
    data = request.json
    from_account_id = data.get('from_account')
    to_account_id = data.get('to_account')
    amount = float(data.get('amount', 0))
    scenario = data.get('scenario', 'standard')
    note = data.get('note', '')
    
    accounts = get_accounts_from_session()
    
    # Validation
    if not from_account_id or not to_account_id:
        return jsonify({'error': 'Please select both source and destination accounts'}), 400
    
    if from_account_id == to_account_id:
        return jsonify({'error': 'Cannot transfer to the same account'}), 400
    
    if amount <= 0:
        return jsonify({'error': 'Amount must be greater than zero'}), 400
    
    if from_account_id not in accounts:
        return jsonify({'error': 'Source account not found'}), 404
    
    if to_account_id not in accounts:
        return jsonify({'error': 'Destination account not found'}), 404
    
    from_account = accounts[from_account_id]
    to_account = accounts[to_account_id]
    
    # Apply scenario-specific logic
    fee = 0
    status = 'completed'
    error_message = None
    
    if scenario == 'insufficient_funds':
        if from_account['balance'] < amount:
            return jsonify({'error': f'Insufficient funds. Available: €{from_account["balance"]:.2f}'}), 400
    
    elif scenario == 'overdraft':
        if from_account['balance'] < amount:
            fee = 35  # Overdraft fee
            status = 'completed_with_fee'
    
    elif scenario == 'high_risk':
        fee = amount * 0.05  # 5% risk fee
        if from_account['balance'] < (amount + fee):
            return jsonify({'error': f'Insufficient funds including risk fee. Need: €{amount + fee:.2f}'}), 400
    
    elif scenario == 'delayed':
        status = 'pending'
    
    # Check sufficient funds (except overdraft scenario)
    if scenario != 'overdraft' and from_account['balance'] < amount:
        return jsonify({'error': f'Insufficient funds. Available: €{from_account["balance"]:.2f}'}), 400
    
    # Execute transfer
    from_account['balance'] -= amount
    if fee > 0:
        from_account['balance'] -= fee
    
    to_account['balance'] += amount
    
    # Update accounts
    accounts[from_account_id] = from_account
    accounts[to_account_id] = to_account
    session['accounts'] = accounts
    
    # Record transaction
    transaction = {
        'id': str(uuid.uuid4())[:8],
        'type': 'transfer',
        'from_account': from_account_id,
        'from_account_name': from_account['name'],
        'to_account': to_account_id,
        'to_account_name': to_account['name'],
        'amount': amount,
        'fee': fee,
        'scenario': scenario,
        'note': note,
        'status': status,
        'timestamp': datetime.now().isoformat()
    }
    
    transactions = get_transactions_from_session()
    transactions.insert(0, transaction)
    session['transactions'] = transactions[:100]  # Keep last 100
    session.modified = True
    
    return jsonify({
        'success': True,
        'transaction': transaction,
        'from_balance': from_account['balance'],
        'to_balance': to_account['balance'],
        'fee_applied': fee
    })

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Get all transactions"""
    transactions = get_transactions_from_session()
    return jsonify(transactions)

@app.route('/api/summary', methods=['GET'])
def get_summary():
    """Get summary statistics"""
    accounts = get_accounts_from_session()
    transactions = get_transactions_from_session()
    
    total_balance = calculate_total_balance(accounts)
    credit_score = calculate_credit_score(accounts, transactions)
    monthly_cash_flow = calculate_monthly_cash_flow(transactions)
    risk_level = determine_risk_level(accounts, transactions)
    
    return jsonify({
        'total_balance': round(total_balance, 2),
        'credit_score': credit_score,
        'monthly_cash_flow': round(monthly_cash_flow, 2),
        'risk_level': risk_level
    })

@app.route('/api/reset', methods=['POST'])
def reset_simulation():
    """Reset the entire simulation"""
    session.clear()
    return jsonify({'success': True, 'message': 'Simulation reset to zero state'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)