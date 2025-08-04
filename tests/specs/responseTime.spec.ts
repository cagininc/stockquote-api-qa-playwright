import { test, expect, request } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { buildSoapBody } from '../data/helpers/buildRequest';

dotenv.config();

// symbols.json dynamic path

const symbols = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../data/symbols.json'), 'utf-8')
).symbols;

test.describe('Response Time Tests for Stock Quotes', () => {
  let apiContext;

  // 1) apı context
  test.beforeAll(async () => {
    apiContext = await request.newContext();
  });

  // 2) tests for every symbol
  for (const symbol of symbols) {
    test(`Response time for ${symbol} should be under 1000ms`, async () => {
      const soapBody = buildSoapBody(symbol);
      const start = Date.now();

      const response = await apiContext.post(process.env.API_ENDPOINT as string, {
        headers: { 'Content-Type': 'text/xml' },
        data: soapBody,
      });

      const duration = Date.now() - start;
      console.log(`⏱️ ${symbol} yanıt süresi: ${duration} ms`);

      expect(response.ok()).toBeTruthy();
      expect(duration).toBeLessThan(1000);
    });
  }
});
