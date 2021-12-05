import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Length,
  Min,
} from 'class-validator';
import { Participate } from 'src/participate/participate.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

  @Column({ type: 'varchar', default: 'participating' })
  @IsIn(states)
  state: PartyState;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  removedAt?: Date;

  @Column({ type: 'bool', default: false })
  usedFirstMessage: boolean;

  @Column({ type: 'bool', default: false })
  usedSecondMessage: boolean;

  @Column({ type: 'datetime', nullable: true })
  otherMessageUsedDate?: Date;

  @Column({ type: 'varchar' })
  hostId: string;

  @OneToMany(() => Participate, (participate) => participate.party, {
    cascade: true,
  })
  participate: Participate[];
}
