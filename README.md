# Amazon Automation Assignment

This repository contains the completed automated test cases for the Amazon Purchase Flow assignment. The framework is built using **Playwright** and **JavaScript**, utilizing the Page Object Model (POM) design pattern for high maintainability and robustness against Amazon's dynamic user interface.

---

## 🎯 The Task Requirements & Completion Status

| Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **Test Case 1**: Navigate to Amazon.com, search for an iPhone, add it to the cart, and print the device price to the console. | ✅ DONE | Located in `tests/amazon-iphone.spec.js` |
| **Test Case 2**: Navigate to Amazon.com, search for a Galaxy device, add it to the cart, and print the device price to the console. | ✅ DONE | Located in `tests/amazon-galaxy.spec.js` |
| **Additional Requirement**: Configure the tests to run Test Case 1 and Test Case 2 in parallel execution. | ✅ DONE | Configured via `workers: 2` in `playwright.config.js` |

---

## 🚀 How to Run the Code (Step-by-Step Guide)

Follow these exact steps to set up and execute the test suite from scratch on your local machine:

### 1. Prerequisites & Setup
Before you begin, ensure you have [Node.js](https://nodejs.org/) installed on your system.

First, clone this repository to your local machine and navigate into the project folder:
```bash
git clone https://github.com/amitkumaryadav2672/testmu-ai-assignment.git
cd testmu-ai-assignment
```

### 2. Install Dependencies
Install all the required Node packages (including Playwright) by running:
```bash
npm install
```

### 3. Install Playwright Browsers
Playwright requires specific browser binaries (like Chromium) to execute the tests. Download them by running:
```bash
npx playwright install
```

### 4. Execute the Tests

You can run the tests either simultaneously (parallel mode) or individually.

#### Option A: Run All Tests in Parallel (Default)
By default, the framework is configured to run both the iPhone and Galaxy test cases at the exact same time using 2 concurrent workers. This significantly speeds up execution.
```bash
npx playwright test
```
*(Note: What happens here is that two browser windows will open simultaneously on your screen. One will execute the iPhone purchase flow independently, and the other will execute the Galaxy purchase flow independently. The terminal will output the extracted device prices for both as they are added to the cart.)*

#### Option B: Run a Single Test Case
If you only want to execute one specific test case without running the other, you can pass the specific file path to the command:

**Run only the iPhone test:**
```bash
npx playwright test tests/amazon-iphone.spec.js
```

**Run only the Galaxy test:**
```bash
npx playwright test tests/amazon-galaxy.spec.js
```

### 5. View the Results Report
Once the tests finish, Playwright automatically generates a detailed HTML report of the test run. You can view it by running:
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
