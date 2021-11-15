type PurchaseStatus = 'paid' | 'ready' | 'failed' | 'cancelled';

export type PurchaseWebhookDto = {
  imp_uid: string;
  merchant_uid: string;
  status: PurchaseStatus;
};

export type PurchaseCompleteDto = {
  imp_uid: string;
  merchant_uid: string;
};

export class ChargeDto {
  id: string;

  @IsInt()
  @Min(0)
  amount: number;
}
