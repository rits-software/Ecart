// src/entities/SalesItem.ts
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  PrimaryColumn,
} from "typeorm";
import { Sales } from "./Sales";
import { Product } from "../master/product";
import { AppDataSource } from "../../config/db";

@Entity()
export class SalesItem {
  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => Sales, (sales) => sales.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sales_id" })
  sales!: Sales;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  subtotal!: number; // quantity * price

  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(SalesItem);

    // Find last SalesItem
    const lastItem = await repo
      .createQueryBuilder("item")
      .orderBy("CAST(SUBSTRING(item.id, 3) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001; // Start from SI1001

    if (lastItem && lastItem.id) {
      const lastNumber = parseInt(lastItem.id.replace("SI", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `SI${nextNumber}`;
  }
}
