import { IsInt, Min } from 'class-validator';

export class ParticipateDto {
  @IsInt()
  @Min(0)
  amount: number;
}
