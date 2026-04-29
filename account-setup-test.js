/**
 * FULL TEST SUITE USING YAML
 */

import fs from "fs";
import yaml from "js-yaml";

const file = fs.readFileSync("testCases.yaml", "utf8");
const testData = yaml.load(file);
const testCases = testData.tests;

const runFullTestSuite = () => {
    console.log("--- STARTING FULL TEST SUITE ---");
    
    const results = { passed: 0, failed: 0 };
    const originalPrompt = global.prompt || (() => null);

    testCases.forEach((test) => {
        // 1. Reset system state
        global.accounts = [];
        let promptIndex = 0;

        // 2. Mock prompt
        global.prompt = () => {
            const val = test.inputs[promptIndex];
            promptIndex++;
            return val;
        };

        // 3. Simulate action
        addAccountBtn.click(); // must exist in your app

        // 4. Verify
        let isPass = false;
        const createdAcc = accounts[0];

        if (test.expect === "STOP") {
            isPass = accounts.length === 0;
        } else {
            isPass =
                accounts.length === 1 &&
                (test.expect.name ? createdAcc.name === test.expect.name : true) &&
                (test.expect.balance !== undefined ? createdAcc.balance === test.expect.balance : true) &&
                (test.expect.type ? createdAcc.type === test.expect.type : true);
        }

        // 5. Output
        if (isPass) {
            console.log(`[PASS] ${test.id}: ${test.name}`);
            results.passed++;
        } else {
            console.log(`[FAIL] ${test.id}: ${test.name}`);
            console.log("Expected:", test.expect);
            console.log("Actual:", accounts);
            results.failed++;
        }
    });

    // Restore prompt
    global.prompt = originalPrompt;

    console.log("---");
    console.log(`RESULTS - Passed: ${results.passed} | Failed: ${results.failed}`);
};

// Run tests
runFullTestSuite();