import { IsInt, Min } from 'class-validator';
import { Purchase } from './purchase.entity';

export type PurchaseStatus = 'paid' | 'ready' | 'failed' | 'cancelled';

export type PurchaseWebhookDto = {
  imp_uid: string;
  merchant_uid: string;
  status: PurchaseStatus;
};

export type PurchaseCompleteDto = {
  imp_uid: string;
  merchant_uid: string;
};

export class PurchaseRequestDto {
  merchant_uid: string;

  @IsInt()
  @Min(0)
  amount: number;
}

export type IamportPaymentsDto = Omit<Purchase, 'user'>;
