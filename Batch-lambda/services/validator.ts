import { campaignSchema, Campaign } from '../types/campaign';

export function validateCampaignData(data: unknown[]): {
  valid: Campaign[],
  invalid: any[]
} {
  const valid: Campaign[] = [];
  const invalid: any[] = [];

  for (const item of data) {
    const result = campaignSchema.safeParse(item);
    if (result.success) {
      valid.push(result.data);
    } else {
      invalid.push(item);
    }
  }

  return { valid, invalid };
}
