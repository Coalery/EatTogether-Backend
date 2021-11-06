import { Party } from './party.entity';

export class CreatePartyDto {
  title: string;
  description?: string;
  restuarant: string;
  meetLatitude: number;
  meetLongitude: number;
  goalPrice: number;
}

export type EditPartyDto = Partial<Omit<Party, 'id' | 'host' | 'participant'>>;
