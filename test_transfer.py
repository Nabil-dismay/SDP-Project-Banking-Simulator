import unittest
from app import app

class TestTransferSystem(unittest.TestCase):
    
    def setUp(self):
        """Setup real Flask test client with test accounts"""
        self.app = app.test_client()
        self.app.post('/api/reset')
        
        # Create test accounts
        resp1 = self.app.post('/api/accounts', json={'name': 'Alice', 'balance': 100.0})
        resp2 = self.app.post('/api/accounts', json={'name': 'Bob', 'balance': 50.0})
        
        self.acc1 = resp1.json['id']
        self.acc2 = resp2.json['id']
    
    def get_balance(self, account_id):
        """Helper to get balance by account ID"""
        resp = self.app.get('/api/accounts')
        for acc in resp.json:
            if acc['id'] == account_id:
                return acc['balance']
        return None
    
    # TC1: Standard Transfer
    def test_tc1_standard_transfer(self):
        response = self.app.post('/api/transfer', json={
            'from_account': self.acc1,
            'to_account': self.acc2,
            'amount': 25.0
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.get_balance(self.acc1), 75.0)
        self.assertEqual(self.get_balance(self.acc2), 75.0)
    
    # TC2: Full Transfer
    def test_tc2_full_transfer(self):
        response = self.app.post('/api/transfer', json={
            'from_account': self.acc1,
            'to_account': self.acc2,
            'amount': 100.0
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.get_balance(self.acc1), 0.0)
        self.assertEqual(self.get_balance(self.acc2), 150.0)
    
    # TC3: Decimal Amount
    def test_tc3_decimal_amount(self):
        response = self.app.post('/api/transfer', json={
            'from_account': self.acc1,
            'to_account': self.acc2,
            'amount': 10.55
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.get_balance(self.acc1), 89.45)
    
    # EC1: Minimum Amount
    def test_ec1_minimum_amount(self):
        response = self.app.post('/api/transfer', json={
            'from_account': self.acc1,
            'to_account': self.acc2,
            'amount': 0.01
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.get_balance(self.acc1), 99.99)
    
    # EH1: Zero Amount
    def test_eh1_zero_amount(self):
        response = self.app.post('/api/transfer', json={
            'from_account': self.acc1,
            'to_account': self.acc2,
            'amount': 0
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['error'], 'Amount must be greater than 0')
    
    # EH1: Negative Amount
    def test_eh1_negative_amount(self):
        response = self.app.post('/api/transfer', json={
            'from_account': self.acc1,
            'to_account': self.acc2,
            'amount': -10
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['error'], 'Amount must be greater than 0')
    
    # EH2: Non-Numeric Amount
    def test_eh2_non_numeric_amount(self):
        response = self.app.post('/api/transfer', json={
            'from_account': self.acc1,
            'to_account': self.acc2,
            'amount': 'abc'
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['error'], 'Invalid amount')
    
    # EH3: Account Not Found
    def test_eh3_account_not_found(self):
        response = self.app.post('/api/transfer', json={
            'from_account': 'invalid_id_123',
            'to_account': self.acc2,
            'amount': 50.0
        })
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json['error'], 'Account not found')
    
    # EH4: Self Transfer
    def test_eh4_self_transfer(self):
        response = self.app.post('/api/transfer', json={
            'from_account': self.acc1,
            'to_account': self.acc1,
            'amount': 50.0
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['error'], 'Cannot transfer to same account')

if __name__ == '__main__':
    unittest.main()