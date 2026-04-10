from flask import Flask, render_template, request, jsonify, session
import uuid
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'


@app.route('/')
def index():
    return render_template('index.html')


# Get all accounts
@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    accounts = session.get('accounts', {})
    return jsonify(list(accounts.values()))


# Create new account
@app.route('/api/accounts', methods=['POST'])
def create_account():
    data = request.json or {}  # ✅ fix: handle None

    accounts = session.get('accounts', {})
    
    account_id = str(uuid.uuid4())[:6]
    new_account = {
        'id': account_id,
        'name': data.get('name', 'New Account'),
        'balance': float(data.get('balance', 0))
    }
    
    accounts[account_id] = new_account
    session['accounts'] = accounts
    return jsonify(new_account), 201


# Delete account
@app.route('/api/accounts/<account_id>', methods=['DELETE'])
def delete_account(account_id):
    accounts = session.get('accounts', {})
    
    if account_id in accounts:
        del accounts[account_id]
        session['accounts'] = accounts
        return jsonify({'success': True})
    
    return jsonify({'error': 'Account not found'}), 404


# Make a transfer
@app.route('/api/transfer', methods=['POST'])
def transfer():
    data = request.json or {}  # ✅ fix

    accounts = session.get('accounts', {})
    transactions = session.get('transactions', [])
    
    from_id = data.get('from_account')
    to_id = data.get('to_account')
    
    try:
        amount = float(data.get('amount', 0))
    except:
        return jsonify({'error': 'Invalid amount'}), 400

    # ✅ fix: validate amount
    if amount <= 0:
        return jsonify({'error': 'Amount must be greater than 0'}), 400

    # Check if accounts exist
    if from_id not in accounts or to_id not in accounts:
        return jsonify({'error': 'Account not found'}), 404

    # ✅ fix: prevent self-transfer
    if from_id == to_id:
        return jsonify({'error': 'Cannot transfer to same account'}), 400

    # Check sufficient balance
    if accounts[from_id]['balance'] < amount:
        return jsonify({'error': 'Insufficient funds'}), 400

    # Process transfer
    accounts[from_id]['balance'] -= amount
    accounts[to_id]['balance'] += amount

    now = datetime.now()  # ✅ cleaner

    # Record transaction
    transaction = {
        'id': str(uuid.uuid4())[:6],
        'from': accounts[from_id]['name'],
        'to': accounts[to_id]['name'],
        'amount': amount,
        'time': now.strftime('%H:%M:%S'),
        'date': now.strftime('%Y-%m-%d')
    }
    
    transactions.insert(0, transaction)
    session['transactions'] = transactions[:20]
    session['accounts'] = accounts
    
    return jsonify({
        'success': True,
        'transaction': transaction,
        'from_balance': accounts[from_id]['balance'],
        'to_balance': accounts[to_id]['balance']
    })


# Get all transactions
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    return jsonify(session.get('transactions', []))


# Get summary stats
@app.route('/api/summary', methods=['GET'])
def get_summary():
    accounts = session.get('accounts', {})
    total = sum(acc['balance'] for acc in accounts.values())
    
    return jsonify({
        'total_balance': total,
        'account_count': len(accounts)
    })


# Reset everything
@app.route('/api/reset', methods=['POST'])
def reset():
    session.clear()
    return jsonify({'success': True})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
