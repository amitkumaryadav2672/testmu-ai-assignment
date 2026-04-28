require('dotenv').config();

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 300000,
  fullyParallel: true,

  use: {
    headless: true
  },

  projects: [
    {
      name: 'LambdaTest Chrome',
      use: {
        browserName: 'chromium',
        connectOptions: {
          wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify({
            browserName: 'Chrome',
            browserVersion: 'latest',
            platform: 'Windows 11',
            build: 'TestMu Assignment Build',
            name: 'Amazon Parallel Test',
            user: process.env.LT_USERNAME,
            accessKey: process.env.LT_ACCESS_KEY
          }))}`
        }
      }
    }
  ]
});
