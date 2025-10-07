import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  BeforeInsert 
} from "typeorm";
import { AppDataSource } from "../../config/db";

@Entity()
export class Unit {
  @PrimaryColumn()
  id!: string;   // <-- Will be V1001, V1002, etc.

  @Column()
  name!: string;

  @Column()
  description!: string;
  
  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(Unit);

    // Find last vendor
    const lastCity = await repo
      .createQueryBuilder("unit")
      .orderBy("CAST(SUBSTRING(unit.id, 2) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001; // Start from CI1001

    if (lastCity && lastCity.id) {
      const lastNumber = parseInt(lastCity.id.replace("U", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `U${nextNumber}`;
  }
}
