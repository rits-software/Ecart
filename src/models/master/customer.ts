import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  OneToMany, 
  BeforeInsert 
} from "typeorm";
import { Product } from "./product";
import { AppDataSource } from "../../config/db";

@Entity()
export class Customer {
  @PrimaryColumn()
  id!: string;   // <-- Will be V1001, V1002, etc.

  @Column()
  name!: string;

  @Column({ nullable: true })
  contact?: string;

  @Column({ nullable: true })
  address?: string;

  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(Customer);

    // Find last customer
    const lastCustomer = await repo
      .createQueryBuilder("customer")
      .orderBy("CAST(SUBSTRING(customer.id, 2) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001; // Start from C1001

    if (lastCustomer && lastCustomer.id) {
      const lastNumber = parseInt(lastCustomer.id.replace("C", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `C${nextNumber}`;
  }
}
