import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  
  testDir: 'tests/specs',
  timeout: 30000,
  retries: 1,
  reporter: [
       ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
      ['allure-playwright', { outputFolder: 'allure-results' }]
     ],
  use: {
    // Base URL for requests, can be used if tests use `baseURL`
    baseURL: process.env.API_ENDPOINT,
    extraHTTPHeaders: {
      'Content-Type': 'text/xml',
    },
    // Collect trace on first retry
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*\.spec\.ts/, // Matches .spec.ts files
    },
  ],
  
});
