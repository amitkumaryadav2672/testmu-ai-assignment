# Amazon Automation Assignment

This repository contains the completed automated test cases for the Amazon Purchase Flow assignment. The framework is built using **Playwright** and **JavaScript/Node.js**, utilizing the Page Object Model (POM) design pattern for high maintainability and robustness against Amazon's dynamic user interface.

---

## 🎯 The Task Requirements & Completion Status

| Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **Test Case 1**: Navigate to Amazon.com, search for an iPhone, add it to the cart, and print the device price to the console. | ✅ DONE | Located in `tests/amazon-iphone.spec.js` |
| **Test Case 2**: Navigate to Amazon.com, search for a Galaxy device, add it to the cart, and print the device price to the console. | ✅ DONE | Located in `tests/amazon-galaxy.spec.js` |
| **Additional Requirement**: Configure the tests to run Test Case 1 and Test Case 2 in parallel execution. | ✅ DONE | Configured via `workers: 2` in `playwright.config.js` |

---

## 🚀 How to Run the Code

Follow these steps to execute the test suite on your local machine:

### 1. Install Node Dependencies
Ensure you have Node.js installed, then run:
```bash
npm install
```

### 2. Install Playwright Browsers
Playwright requires specific browser binaries (Chromium) to execute the tests:
```bash
npx playwright install
```

### 3. Execute the Tests (Parallel Mode)
Run the following command to execute both test cases simultaneously in parallel:
```bash
npx playwright test
```

*(Note: The terminal will output the extracted device prices for both the iPhone and Samsung Galaxy as they are added to the cart.)*

### 4. View the Results Report
Once the tests finish, you can view the detailed HTML report by running:
```bash
npx playwright show-report
```

---

## 🏗️ Project Architecture & Robustness

Amazon's UI is highly dynamic and features strict anti-bot protections. This framework was specifically engineered to bypass these challenges:

* **Page Object Model (POM)**: Core logic is abstracted into `pages/AmazonPage.js`.
* **Dynamic Location Bypassing**: Amazon often region-locks products (e.g., showing "Currently Unavailable" if shipping to India). The script automatically detects this, aggressively clicks through the location modals, and pins the Zip Code to `10001` (New York) to ensure products are shippable.
* **Popup Resilience**: Amazon randomly injects "Add Extra Protection" (Asurion/AppleCare) modals right before adding items to the cart. This framework aggressively scans for these modals and automatically clicks **"No Thanks"** to bypass them.
* **Smart Locators**: Uses fallback locators to handle A/B testing on Amazon's "Add to Cart" vs. "See All Buying Options" buttons.

## 📂 Folder Structure
```text
testmu-ai-assignment/
│ package.json
│ playwright.config.js      # Global config (Parallel execution, Timeouts, Reporters)
│ README.md                 # Project documentation
│ .gitignore                # Excludes node_modules and generated reports
│
├── tests/                  # Test Specs
│   ├── amazon-iphone.spec.js
│   └── amazon-galaxy.spec.js
│
├── pages/                  # Page Object Models
│   └── AmazonPage.js       # Core Amazon interaction logic
│
├── test-data/              # Externalized Test Data
│   └── products.json       # Search terms and test metadata
│
└── utils/                  # Helper Utilities
    └── logger.js           # Custom console logging for test steps
```

---
**Author**: Amit Kumar Yadav
