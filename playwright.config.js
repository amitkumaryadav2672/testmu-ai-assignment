// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 300000, // 5 minutes timeout as requested
  fullyParallel: true, // Enable parallel execution
  workers: 2, // Allow 2 tests to run simultaneously in parallel
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    headless: false, // Keep headed so you can see if a captcha appears
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Removed userDataDir to allow true parallel execution without profile locking
    // REAL HUMAN USER AGENT
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
