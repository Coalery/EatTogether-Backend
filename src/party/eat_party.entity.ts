import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../entity/user.entity';

@Entity({ name: 'EatParty' })
export class EatParty {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  restuarant: string;

  @Column({ type: 'int' })
  @IsNotEmpty()
  meetLatitude: number;

  @Column({ type: 'int' })
  @IsNotEmpty()
  meetLongitude: number;

  @Column({ type: 'int' })
  @IsNotEmpty()
  goalPrice: number;

  @OneToOne(() => User)
  @JoinColumn()
  host: User;

  @OneToMany(() => User, (user) => user.party)
  participant: User[];
}
