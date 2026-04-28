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
            user: "yadavamit847412",
            accessKey: "LT_ctiGdScq5bQoWrk9nCVtUh82ijlgPXmocHpyfuPCjQnYtN3"
          }))}`
        }
      }
    }
  ]
});
