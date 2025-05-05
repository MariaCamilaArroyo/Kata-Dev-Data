import { Campaign } from '../types/campaign';

export function validateCampaignData(data: any[]): {
  valid: Campaign[],
  invalid: any[]
} {
  const valid: Campaign[] = [];
  const invalid: any[] = [];

  for (const item of data) {
    if (item.id && item.name && typeof item.name === 'string') {
      valid.push(item as Campaign);
    } else {
      invalid.push(item);
    }
  }

  return { valid, invalid };
}
