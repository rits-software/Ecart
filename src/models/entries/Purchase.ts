// src/entities/Purchase.ts
import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
} from "typeorm";
import { Vendor } from "../master/vendor";
import { PurchaseItem } from "./PurchaseItem";
import { AppDataSource } from "../../config/db";

@Entity()
export class Purchase {
  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: "vendor_id" })
  vendor!: Vendor;

  @OneToMany(() => PurchaseItem, (item) => item.purchase, {
    cascade: true,
    eager: true,
  })
  items!: PurchaseItem[];

  @Column({ type: "decimal", precision: 12, scale: 2 })
  total!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(Purchase);

    // Find last Purchase
    const lastPurchase = await repo
      .createQueryBuilder("purchase")
      .orderBy("CAST(SUBSTRING(purchase.id, 3) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001; // Start from PO1001

    if (lastPurchase && lastPurchase.id) {
      const lastNumber = parseInt(lastPurchase.id.replace("PO", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `PO${nextNumber}`;
  }
}
