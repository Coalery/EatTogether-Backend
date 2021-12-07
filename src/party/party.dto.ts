import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreatePartyDto {
  @IsNotEmpty()
  title: string;

  description?: string;

  @IsNotEmpty()
  restuarant: string;

  @IsNumber()
  @Min(-90.0)
  @Max(90.0)
  meetLatitude: number;

  @IsNumber()
  @Min(-180.0)
  @Max(180.0)
  meetLongitude: number;

  @IsInt()
  @Min(0)
  goalPrice: number;
}

export class EditPartyDto {
  description?: string;

  @IsNumber()
  @Min(-90.0)
  @Max(90.0)
  meetLatitude?: number;

  @IsNumber()
  @Min(-180.0)
  @Max(180.0)
  meetLongitude?: number;

  @IsInt()
  @Min(0)
  goalPrice?: number;
}
