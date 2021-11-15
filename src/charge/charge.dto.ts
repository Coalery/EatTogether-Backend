import { IsInt, Min } from 'class-validator';

export class ChargeDto {
  @IsInt()
  id: string;

  @IsInt()
  @Min(0)
  amount: number;
}
