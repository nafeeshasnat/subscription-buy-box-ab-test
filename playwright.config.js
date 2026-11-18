const { defineConfig, devices } = require('@playwright/test');
const target = process.env.DEMO_BASE_URL;
module.exports = defineConfig({
  testDir: './tests',
  retries: 0,
  workers: 2,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: target || 'http://127.0.0.1:8765/' },
  webServer: target ? undefined : {
    command: 'python3 -m http.server 8765 --bind 127.0.0.1',
    url: 'http://127.0.0.1:8765'
  },
  projects: [
    { name: 'Desktop Chromium', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
    { name: 'Mobile Chromium emulation', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } }
  ]
});
