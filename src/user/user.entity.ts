import { IsNotEmpty } from 'class-validator';
import { Participate } from 'src/participate/participate.entity';
import { Party } from 'src/party/party.entity';
import { Purchase } from 'src/purchase/purchase.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

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

  @OneToOne(() => Party, (party) => party.host)
  party: Party;

  @OneToMany(() => Participate, (participate) => participate.participant)
  participate: Participate[];

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchase: Purchase[];
}
