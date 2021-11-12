import { IsInt, Min } from 'class-validator';

export class OrderDto {
  @IsInt()
  id: string;

  @IsInt()
  @Min(0)
  amount: number;
}
