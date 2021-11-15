import { IsInt, Min } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { PurchaseStatus } from './purchase.dto';

@Entity({ name: 'Purchase' })
export class Purchase {
  @PrimaryColumn({ type: 'varchar' })
  merchant_uid: string;

  @Column({ type: 'varchar' })
  imp_uid: string;

  @Column({ type: 'int' })
  @IsInt()
  @Min(0)
  amount: number;

  @Column({ type: 'varchar' })
  pay_method: string;

  @Column({ type: 'varchar' })
  channel: string;

  @Column({ type: 'varchar' })
  status: PurchaseStatus;

  @Column({ type: 'int' })
  started_at: number;

  @Column({ type: 'int' })
  paid_at: number;

  @Column({ type: 'int' })
  failed_at: number;

  @Column({ type: 'int' })
  cancelled_at: number;

  @Column({ type: 'varchar' })
  fail_reason: string;

  @Column({ type: 'varchar' })
  cancel_reason: string;

  @ManyToOne(() => User, (user) => user.purchase)
  user: User;
}
