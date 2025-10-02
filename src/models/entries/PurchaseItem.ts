// src/entities/PurchaseItem.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Purchase } from "./Purchase";
import { Product } from "../master/product";

@Entity()
export class PurchaseItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Purchase, (purchase) => purchase.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "purchase_id" })
  purchase!: Purchase;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  subtotal!: number; // quantity * price
}
