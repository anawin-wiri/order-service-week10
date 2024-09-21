import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  productId: number;
  @Column()
  email: string;
  @Column()
  status: string;
}
