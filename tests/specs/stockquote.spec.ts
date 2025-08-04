import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import dotenv from 'dotenv';
import { buildSoapBody } from '../data/helpers/buildRequest';
import { sendSoapRequest } from '../utils/apiClient';
dotenv.config();

const symbols = JSON.parse(fs.readFileSync('./tests/data/symbols.json', 'utf-8')).symbols;

test.describe('SOAP Stock Quote API Tests', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext();
  });

  for (const symbol of symbols) {
    test(`Check stock quote for ${symbol}`, async ({}, testInfo) => {
      
      testInfo.annotations.push({ type: 'description', description: `Verifies that the SOAP API correctly returns stock data for ${symbol}.` });
      testInfo.annotations.push({ type: 'severity', description: 'critical' });

      //  1. Adım: SOAP Body oluşturuluyor
      await test.step('Build SOAP Request Body', async () => {
        const soapBody = buildSoapBody(symbol);

        //  2. Adım: API isteği gönderiliyor
        await test.step('Send SOAP Request', async () => {
          const response = await sendSoapRequest(apiContext, symbol);

          //  3. Adım: Yanıt doğrulanıyor
          await test.step('Validate response', async () => {
            expect(response.ok()).toBeTruthy();

            const responseBody = await response.text();

            // 4. Adım: Yanıtı Allure’a XML olarak ekle
            await testInfo.attach(`${symbol} SOAP Response`, {
                body: Buffer.from(responseBody, 'utf-8'),
                contentType: 'text/xml',
              });
            expect(responseBody).toContain(`<symbol>${symbol}</symbol>`);
          });
        });
      });
    });
  }
});
