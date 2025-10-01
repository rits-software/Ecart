import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Vendor } from "../master/vendor";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  sku!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  purchasePrice!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  sellingPrice!: number;

  @Column("int")
  quantity!: number;

  @Column("decimal", { precision: 5, scale: 2, default: 0 })
  taxRate!: number;

  @ManyToOne(() => Vendor, (vendor) => vendor.products)
  @JoinColumn({ name: "vendor_id" })
  vendor!: Vendor;

  @Column()
  vendor_id!: string;
}
