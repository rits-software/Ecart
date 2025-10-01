import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  OneToMany, 
  BeforeInsert 
} from "typeorm";
import { Product } from "../master/product";
import { AppDataSource } from "../../config/db";

@Entity()
export class Vendor {
  @PrimaryColumn()
  id!: string;   // <-- Will be V1001, V1002, etc.

  @Column()
  name!: string;

  @Column({ nullable: true })
  contact?: string;

  @Column({ nullable: true })
  address?: string;

  @OneToMany(() => Product, (product) => product.vendor)
  products!: Product[];

  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(Vendor);

    // Find last vendor
    const lastVendor = await repo
      .createQueryBuilder("vendor")
      .orderBy("CAST(SUBSTRING(vendor.id, 2) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001; // Start from V1001

    if (lastVendor && lastVendor.id) {
      const lastNumber = parseInt(lastVendor.id.replace("V", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `V${nextNumber}`;
  }
}
