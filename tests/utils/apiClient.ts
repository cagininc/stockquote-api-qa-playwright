import { APIResponse, APIRequestContext } from '@playwright/test';
import { buildSoapBody } from '../data/helpers/buildRequest';

export async function sendSoapRequest(
  apiContext: APIRequestContext,
  symbol: string
): Promise<APIResponse> {
  const soapBody = buildSoapBody(symbol);
  const response = await apiContext.post(process.env.API_ENDPOINT as string, {
    headers: {
      'Content-Type': 'text/xml',
    },
    data: soapBody,
  });
  return response;
}
