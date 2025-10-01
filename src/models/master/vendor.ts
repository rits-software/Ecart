import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "../master/product";

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  contact?: string;

  @Column({ nullable: true })
  address?: string;

  @OneToMany(() => Product, (product) => product.vendor)
  products!: Product[];
}
