import { IsInt, Min } from 'class-validator';
import { Party } from 'src/party/party.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Participate' })
export class Participate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bool', default: false })
  isSuccessAgree: boolean;

  @Column({ type: 'int' })
  @IsInt()
  @Min(0)
  amount: number;

  @ManyToOne(() => Party, (party) => party.participate)
  party: Party;

  @ManyToOne(() => User, (user) => user.participate)
  participant: User;
}
