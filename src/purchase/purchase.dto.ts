type PurchaseStatus = 'paid' | 'ready' | 'failed' | 'cancelled';

export type PurchaseDto = {
  imp_uid: string;
  merchant_uid: string;
  status: PurchaseStatus;
};
