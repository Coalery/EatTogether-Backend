import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { EatParty } from './eat_party.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 128, unique: true })
  @IsNotEmpty()
  name: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  profileURL?: string;

  @Column({ type: 'int', default: 0 })
  point: number;

  @OneToOne(() => EatParty, (party) => party.host)
  partyForHost: EatParty;

  @ManyToOne(() => EatParty, (party) => party.participant)
  party: EatParty;
}
