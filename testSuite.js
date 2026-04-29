import fs from "fs";
import yaml from "js-yaml";

// 1. SAFETY CHECK: Check if the file exists before reading
if (!fs.existsSync("testCases.yaml")) {
    console.error("CRITICAL ERROR: testCases.yaml not found in root!");
    console.log("Current Directory Files:", fs.readdirSync("."));
    process.exit(1);
}

const file = fs.readFileSync("testCases.yaml", "utf8");
const testData = yaml.load(file);
const testCases = testData.tests;

const runFullTestSuite = () => {
    console.log("--- STARTING TEST SUITE ---");
    let passed = 0;
    let failed = 0;

    testCases.forEach((test) => {
        // --- YOUR APP LOGIC GOES HERE ---
        // For now, we simulate the logic based on your inputs
        const nameInput = test.inputs[0];
        const typeInput = test.inputs[1];
        const balanceInput = parseFloat(test.inputs[2]);

        let actual = null;
        if (nameInput !== null && nameInput !== "") {
            actual = { 
                name: nameInput, 
                type: typeInput || "General", 
                balance: isNaN(balanceInput) ? 0 : balanceInput 
            };
        }

        // --- VERIFICATION ---
        let isPass = false;
        if (test.expect === "STOP") {
            isPass = actual === null;
        } else {
            isPass = actual && 
                     actual.name === test.expect.name && 
                     actual.balance === test.expect.balance;
        }

        if (isPass) {
            console.log(`✅ [PASS] ${test.id}`);
            passed++;
        } else {
            console.log(`❌ [FAIL] ${test.id}`);
            failed++;
        }
    });

    console.log(`\nTOTAL: ${passed} Passed | ${failed} Failed`);
    if (failed > 0) process.exit(1);
};

runFullTestSuite();