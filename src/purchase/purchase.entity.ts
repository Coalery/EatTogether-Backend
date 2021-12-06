import { IsInt, Min } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { PurchaseStatus } from './purchase.dto';

@Entity({ name: 'Purchase' })
export class Purchase {
  @PrimaryColumn({ type: 'varchar' })
  merchant_uid: string;

  @Column({ type: 'varchar', nullable: true })
  imp_uid?: string;

  @Column({ type: 'int' })
  @IsInt()
  @Min(0)
  amount: number;

  @Column({ type: 'varchar' })
  status: PurchaseStatus;

  @ManyToOne(() => User, (user) => user.purchase)
  user: User;
}
