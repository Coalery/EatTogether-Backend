import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class GatherCompleteDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  partyId: number;
}
