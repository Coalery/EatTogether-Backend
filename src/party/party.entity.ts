import { IsInt, IsNotEmpty, IsNumber, Length, Min } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

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

  @Column({ type: 'boolean', default: false })
  isComplete: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  host: User;

  @OneToMany(() => User, (user) => user.party)
  participant: User[];
}
