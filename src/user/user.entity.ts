import { IsNotEmpty } from 'class-validator';
import { Order } from 'src/order/order.entity';
import { Party } from 'src/party/party.entity';
import { Purchase } from 'src/purchase/purchase.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'User' })
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 128, unique: true })
  @IsNotEmpty()
  name: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  profileURL?: string;

  @Column({ type: 'int', default: 0 })
  point: number;

  @OneToOne(() => Party, (party) => party.host)
  party: Party;

  @OneToMany(() => Order, (order) => order.user)
  order: Order[];

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchase: Purchase[];
}
