import { IsInt, Min } from 'class-validator';
import { Party } from 'src/party/party.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryColumn({ type: 'int' })
  @IsInt()
  id: string;

  @Column({ type: 'int' })
  @IsInt()
  @Min(0)
  amount: number;

  @ManyToOne(() => User, (user) => user.order)
  user: User;

  @ManyToOne(() => Party, (party) => party.participantOrders)
  participantParty: Party;
}
