import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  BeforeInsert 
} from "typeorm";
import { AppDataSource } from "../../config/db";

@Entity()
export class City {
  @PrimaryColumn()
  id!: string;   // <-- Will be V1001, V1002, etc.

  @Column()
  name!: string;

  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(City);

    // Find last vendor
    const lastCity = await repo
      .createQueryBuilder("city")
      .orderBy("CAST(SUBSTRING(city.id, 3) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001; // Start from CI1001

    if (lastCity && lastCity.id) {
      const lastNumber = parseInt(lastCity.id.replace("CI", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `CI${nextNumber}`;
  }
}
