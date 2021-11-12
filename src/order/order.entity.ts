import { IsInt, Min } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('order')
export class Order {
  @Column({ type: 'int' })
  @IsInt()
  @Min(0)
  amount: number;

  @ManyToOne(() => User, (user) => user.order)
  user: User;
}
