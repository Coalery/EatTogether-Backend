import { IsNotEmpty } from 'class-validator';
import { Order } from 'src/order/order.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Party } from '../party/party.entity';

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
  partyForHost: Party;

  @OneToMany(() => Order, (order) => order.user)
  order: Order[];

  @ManyToOne(() => Party, (party) => party.participant)
  party: Party;
}
