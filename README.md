# Amazon Automation Assignment (Playwright)

This project automates the purchase flow on Amazon using Playwright and Node.js. It follows the Page Object Model (POM) pattern for maintainability and includes robust handling for dynamic e-commerce elements.

## Tech Stack
* **Playwright** (JavaScript)
* **Node.js**
* **Page Object Model** (POM) Architecture

## Key Features
* **Smart Search**: Automatically searches for specified products from `products.json`.
* **Price Extraction**: Robustly captures device prices across different Amazon layouts.
* **Intelligent Add-to-Cart**: Handles both direct "Add to Cart" and multi-seller "See Buying Options" flows.
* **Popup Resilience**: Automatically dismisses "Protection Plan" and "Location" overlays.
* **Professional Reporting**: Generates HTML reports with screenshots and videos on failure.

---

## How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Run All Tests
```bash
npx playwright test
```

### 4. Watch the Automation (Headed Mode)
```bash
npx playwright test --headed
```

### 5. View the Results Report
```bash
npx playwright show-report
```

---

## Parallel Execution
By default, this project is configured to run tests in parallel using Playwright's `workers: 2` configuration. When you run `npx playwright test`, both the iPhone and Galaxy tests will execute simultaneously in separate browser instances to save time.

---

## Folder Structure
```text
testmu-ai-assignment/
│ package.json
│ playwright.config.js
│ README.md
│ .gitignore
│
├── tests/              # Contains the Playwright spec files (amazon-iphone, amazon-galaxy)
├── pages/              # Contains the Page Object Model (AmazonPage.js)
├── test-data/          # Contains JSON test data (products.json)
└── utils/              # Contains custom logger utilities
```

---

## Test Scenarios
* **iPhone 13 Flow**: Navigates, searches, extracts price, and adds to cart.
* **Samsung Galaxy A15 Flow**: Navigates, searches, extracts price, and handles fallback buying options.

## Engineering Notes
Amazon uses a highly dynamic UI. This framework implements a **fallback strategy**: if the standard "Add to Cart" button is missing (common for high-demand items), it automatically switches to the "Buying Options" workflow to ensure the test completes successfully.

---
**Author**: Amit Kumar Yadav
