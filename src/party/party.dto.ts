export class CreatePartyDto {
  title: string;
  description?: string;
  restuarant: string;
  meetLatitude: number;
  meetLongitude: number;
  goalPrice: number;
}

export type EditPartyDto = Partial<CreatePartyDto>;
