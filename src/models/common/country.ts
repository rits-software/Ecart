import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  BeforeInsert 
} from "typeorm";
import { AppDataSource } from "../../config/db";

@Entity()
export class Country {
  @PrimaryColumn()
  id!: string;   // <-- Will be V1001, V1002, etc.

  @Column()
  name!: string;

  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(Country);

    // Find last country
    const lastCountry = await repo
      .createQueryBuilder("country")
      .orderBy("CAST(SUBSTRING(country.id, 3) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001; // Start from CY1001

    if (lastCountry && lastCountry.id) {
      const lastNumber = parseInt(lastCountry.id.replace("CY", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `CY${nextNumber}`;
  }
}
