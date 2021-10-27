import { IsNotEmpty } from 'class-validator';

export class CreatePartyDto {
  @IsNotEmpty()
  title: string;

  description?: string;

  @IsNotEmpty()
  restuarant: string;
}
