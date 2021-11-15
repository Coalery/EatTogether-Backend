import { IsInt, Min } from 'class-validator';

export class ChargeDto {
  id: string;

  @IsInt()
  @Min(0)
  amount: number;
}
