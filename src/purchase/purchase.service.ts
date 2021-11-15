import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { IamportPaymentsDto } from './purchase.dto';
import { Purchase } from './purchase.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async onRequest(
    user: User,
    merchant_uid: string,
    amount: number,
  ): Promise<Purchase> {
    const newPurchaseRequest: Purchase = new Purchase();
    newPurchaseRequest.user = user;
    newPurchaseRequest.merchant_uid = merchant_uid;
    newPurchaseRequest.amount = amount;
    return this.purchaseRepository.create(newPurchaseRequest);
  }

  async onComplete(imp_uid: string, merchant_uid: string) {
    const accessToken: string = await this.getAccessToken();
    const paymentData: IamportPaymentsDto = await this.getPaymentData(
      imp_uid,
      accessToken,
    );

    const order = await this.purchaseRepository.findOne(
      paymentData.merchant_uid,
    );
    const amountToBePaid = order.amount;

    const { amount, status } = paymentData;
    if (amount === amountToBePaid) {
      await this.purchaseRepository.update({ merchant_uid }, paymentData);
      if (status === 'paid') {
        return { status: 'success', message: '일반 결제 성공' };
      }
    } else {
      throw new HttpException('Forged payment.', HttpStatus.BAD_REQUEST);
    }
  }

  private async getAccessToken(): Promise<string> {
    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        'https://api.iamport.kr/users/getToken',
        {
          imp_key: this.configService.get('iamport.key'),
          imp_secret: this.configService.get('iamport.secret'),
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    ).catch(() => {
      throw new HttpException(
        'An error occurred while obtaining the access token.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
    return tokenResponse.data.response.access_token;
  }

  private async getPaymentData(imp_uid: string, accessToken: string) {
    const paymentResponse = await firstValueFrom(
      this.httpService.get(`https://api.iamport.kr/payments/${imp_uid}`, {
        headers: { Authorization: accessToken },
      }),
    ).catch(() => {
      throw new HttpException('Wrong imp_uid.', HttpStatus.BAD_REQUEST);
    });
    return paymentResponse.data.response;
  }
}
