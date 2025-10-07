import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  BeforeInsert 
} from "typeorm";
import { AppDataSource } from "../../config/db";

@Entity()
export class PaymentMode {
  @PrimaryColumn()
  id!: string;   // <-- Will be V1001, V1002, etc.

  @Column()
  name!: string;

  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(PaymentMode);

    // Find last vendor
    const lastPM = await repo
      .createQueryBuilder("paymentmode")
      .orderBy("CAST(SUBSTRING(paymentmode.id, 3) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001; // Start from PM1001

    if (lastPM && lastPM.id) {
      const lastNumber = parseInt(lastPM.id.replace("PM", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `PM${nextNumber}`;
  }
}
