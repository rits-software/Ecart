import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  BeforeInsert 
} from "typeorm";
import { Vendor } from "../master/vendor";
import { AppDataSource } from "../../config/db";

@Entity()
export class Product {
  @PrimaryColumn()
  id!: string;  // <-- Now this will be "P1001", "P1002", etc.

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

  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(Product);

    // Find the latest ID
    const lastProduct = await repo
      .createQueryBuilder("product")
      .orderBy("CAST(SUBSTRING(product.id, 2) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001; // start from P1001

    if (lastProduct && lastProduct.id) {
      const lastNumber = parseInt(lastProduct.id.replace("P", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `P${nextNumber}`;
  }
}
