// src/entities/Sales.ts
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
import { Customer } from "../master/customer";
import { AppDataSource } from "../../config/db";
import { SalesItem } from "./salesItem";

@Entity()
export class Sales {
  @PrimaryColumn()
  id!: string;   // Will default to varchar in DB

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer!: Customer;

  @OneToMany(() => SalesItem, (item) => item.sales, {
    cascade: true,
    eager: true,
  })
  items!: SalesItem[];

  @Column({ type: "decimal", precision: 12, scale: 2 })
  total!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(Sales);

    // Find last Sale
    const lastSale = await repo
      .createQueryBuilder("sales")
      .orderBy("CAST(SUBSTRING(sales.id, 3) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001; // Start from SO1001

    if (lastSale && lastSale.id) {
      const lastNumber = parseInt(lastSale.id.replace("SO", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `SO${nextNumber}`;
  }
}
