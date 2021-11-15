import { IsInt, Min } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Purchase' })
export class Purchase {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'int' })
  @IsInt()
  @Min(0)
  amount: number;

  @ManyToOne(() => User, (user) => user.purchase)
  user: User;
}
