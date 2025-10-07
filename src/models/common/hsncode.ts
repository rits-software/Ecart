import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  BeforeInsert 
} from "typeorm";
import { AppDataSource } from "../../config/db";

@Entity()
export class HSNCode {
  @PrimaryColumn()
  id!: string;   // <-- Will be V1001, V1002, etc.

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  gst!: string;
  
  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(HSNCode);

    // Find last vendor
    const lastHSN = await repo
      .createQueryBuilder("hsncode")
      .orderBy("CAST(SUBSTRING(hsncode.id, 4) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001; // Start from HSN1001

    if (lastHSN && lastHSN.id) {
      const lastNumber = parseInt(lastHSN.id.replace("HSN", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `HSN${nextNumber}`;
  }
}
