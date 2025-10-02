// src/entities/Purchase.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { Vendor } from "../master/vendor";
import { PurchaseItem } from "./PurchaseItem";

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: "vendor_id" })
  vendor!: Vendor;

  @OneToMany(() => PurchaseItem, (item) => item.purchase, { cascade: true, eager: true })
  items!: PurchaseItem[];

  @Column({ type: "decimal", precision: 12, scale: 2 })
  total!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "text", nullable: true })
  notes?: string;
}
