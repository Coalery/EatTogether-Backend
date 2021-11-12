import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Length,
  Min,
} from 'class-validator';
import { Order } from 'src/order/order.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

const states = [
  'participating',
  'gather-complete',
  'success',
  'canceled',
] as const;
type PartyState = typeof states[number];

@Entity({ name: 'Party' })
export class Party {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  @Length(1, 100)
  restuarant: string;

  @Column({ type: 'decimal' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.0)
  meetLatitude: number;

  @Column({ type: 'decimal' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.0)
  meetLongitude: number;

  @Column({ type: 'int' })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  goalPrice: number;

  @Column({ type: 'varchar', default: false })
  @IsIn(states)
  state: PartyState;

  @Column({ type: 'datetime' })
  @IsDate()
  createdAt: Date;

  @Column({ type: 'datetime' })
  @IsDate()
  removedAt: Date;

  @OneToOne(() => User, (user) => user.party)
  @JoinColumn()
  host: User;

  @OneToMany(() => Order, (order) => order.participantParty)
  participantOrders: Order[];
}
