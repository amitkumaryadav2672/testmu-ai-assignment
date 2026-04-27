# TestMu AI - Amazon Automation Assignment

This repository contains the automation assignment for the **Customer Engineering Intern** role at **TestMu AI**.

## 🚀 Project Overview
The project automates two search-and-add-to-cart scenarios on Amazon.com using **Playwright** with **JavaScript**. It follows the **Page Object Model (POM)** design pattern for scalability and maintainability.

### Features
- **Parallel Execution**: Both test cases run simultaneously to optimize execution time.
- **Page Object Model**: Encapsulated UI logic in `pages/` directory.
- **Reporting**: Automated HTML reports generated after each run.
- **Logging**: Custom logger for detailed console output.
- **CI/CD Ready**: Integrated with GitHub Actions.

---

## 🛠️ Tech Stack
- **Framework**: [Playwright](https://playwright.dev/)
- **Language**: JavaScript (Node.js)
- **Pattern**: Page Object Model (POM)
- **Reporting**: Playwright HTML Reporter

---

## 📁 Project Structure
```text
testmu-ai-assignment/
│── tests/                  # Test specification files
│   ├── amazon-iphone.spec.js
│   └── amazon-galaxy.spec.js
├── pages/                  # Page Object classes (POM)
│   └── AmazonPage.js
├── test-data/              # JSON data for tests
│   └── products.json
├── utils/                  # Helper utilities and Logger
│   └── logger.js
├── reports/                # HTML test reports (generated)
├── playwright.config.js    # Playwright configuration (Parallelism, Browsers)
└── README.md               # Project documentation
```

---

## ⚙️ Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd testmu-ai-assignment
```

### 2. Install dependencies
```bash
npm install
npx playwright install
```

### 3. Run Tests (Parallel)
To run all tests in parallel mode:
```bash
npx playwright test
```

### 4. View Report
After the tests complete, view the detailed HTML report:
```bash
npx playwright show-report reports
```

---

## ☁️ LambdaTest Integration (Bonus)
To run these tests on the LambdaTest Cloud, update the `playwright.config.js` with your credentials:
1. Set environment variables:
   - `LT_USERNAME`: Your LambdaTest username
   - `LT_ACCESS_KEY`: Your LambdaTest access key
2. Uncomment the `lambdatest-chrome` project in `playwright.config.js`.

---

## 👨‍💻 Author
**Amit Kumar Yadav**
- GitHub: [@your-username](https://github.com/your-username)
- Role: Customer Engineering Intern Applicant
