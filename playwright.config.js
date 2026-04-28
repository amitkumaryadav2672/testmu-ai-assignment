const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 300000,
  fullyParallel: true,
  workers: 2, // Forces parallel execution
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    headless: false, // This forces the browsers to open visually on your screen!
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: 'Local Chrome',
      use: { ...devices['Desktop Chrome'] },
    }
    // Note: LambdaTest Cloud integration was removed so the browsers open locally on your computer instead of the cloud.
  ]
});
