import unittest


class MockTransferSystem:
    def __init__(self):
        self.accounts = {"acc1": 100.0, "acc2": 50.0}
        self.logs = []

    def process_transfer(self, payload):
        amount = payload.get("amount")
        from_acc = payload.get("from_account")
        to_acc = payload.get("to_account")

        # Error Handling
        if from_acc not in self.accounts or to_acc not in self.accounts:
            return {"error": "Account not found"}
        if from_acc == to_acc:
            return {"error": "Cannot transfer to same account"}
        if not isinstance(amount, (int, float)):
            return {"error": "Invalid amount"}
        if amount <= 0:
            return {"error": "Amount must be greater than 0"}

        # Process Transfer
        self.accounts[from_acc] -= amount
        self.accounts[to_acc] += amount
        
        # Logging limit
        self.logs.append(payload)
        if len(self.logs) > 20:
            self.logs = self.logs[-20:]

        return {"success": True}

# UNIT TESTS

class TestTransferSystem(unittest.TestCase):

    def setUp(self):
        # We initialize the system so 'acc1' has 100.0 and 'acc2' has 50.0 
        # to match the expected  (100 - 25 = 75).
        self.system = MockTransferSystem()

    # Input-Output Test Cases 
    
    def test_tc1_standard_transfer(self):
        """TC1: Standard Transfer of 25.0"""
        payload = {"from_account": "acc1", "to_account": "acc2", "amount": 25.0}
        response = self.system.process_transfer(payload)
        
        self.assertTrue(response.get("success"))
        self.assertAlmostEqual(self.system.accounts["acc1"], 75.0)
        self.assertAlmostEqual(self.system.accounts["acc2"], 75.0)

    def test_tc2_full_transfer(self):
        """TC2: Full Transfer of 100.0"""
        payload = {"from_account": "acc1", "to_account": "acc2", "amount": 100.0}
        response = self.system.process_transfer(payload)
        
        self.assertTrue(response.get("success"))
        self.assertAlmostEqual(self.system.accounts["acc1"], 0.0)
        self.assertAlmostEqual(self.system.accounts["acc2"], 150.0)

    def test_tc3_decimal_amount(self):
        """TC3: Decimal Amount Transfer of 10.55"""
        payload = {"from_account": "acc1", "to_account": "acc2", "amount": 10.55}
        response = self.system.process_transfer(payload)
        
        self.assertTrue(response.get("success"))
        self.assertAlmostEqual(self.system.accounts["acc1"], 89.45)

    # Edge Cases 

    def test_ec1_minimum_amount(self):
        """EC1: Minimum Amount Transfer of 0.01"""
        payload = {"from_account": "acc1", "to_account": "acc2", "amount": 0.01}
        response = self.system.process_transfer(payload)
        self.assertTrue(response.get("success"))

    def test_ec2_transaction_limit(self):
        """EC2: Only 20 most recent logs kept in session after 21 transfers"""
        for _ in range(21):
            payload = {"from_account": "acc1", "to_account": "acc2", "amount": 1.0}
            self.system.process_transfer(payload)
            
        self.assertEqual(len(self.system.logs), 20)

    # Error Handling Tests

    def test_eh1_zero_negative_amount(self):
        """EH1: Zero or Negative Amount"""
        payload_zero = {"from_account": "acc1", "to_account": "acc2", "amount": 0}
        payload_neg = {"from_account": "acc1", "to_account": "acc2", "amount": -10}
        
        response_zero = self.system.process_transfer(payload_zero)
        response_neg = self.system.process_transfer(payload_neg)
        
        self.assertEqual(response_zero.get("error"), "Amount must be greater than 0")
        self.assertEqual(response_neg.get("error"), "Amount must be greater than 0")

    def test_eh2_non_numeric_amount(self):
        """EH2: Non-Numeric Amount"""
        payload = {"from_account": "acc1", "to_account": "acc2", "amount": "abc"}
        response = self.system.process_transfer(payload)
        
        self.assertEqual(response.get("error"), "Invalid amount")

    def test_eh3_account_not_found(self):
        """EH3: Account Not Found"""
        payload = {"from_account": "invalid", "to_account": "acc2", "amount": 10.0}
        response = self.system.process_transfer(payload)
        
        self.assertEqual(response.get("error"), "Account not found")

    def test_eh4_self_transfer(self):
        """EH4: Self-Transfer"""
        payload = {"from_account": "acc1", "to_account": "acc1", "amount": 10.0}
        response = self.system.process_transfer(payload)
        
        self.assertEqual(response.get("error"), "Cannot transfer to same account")

if __name__ == '__main__':
    unittest.main()