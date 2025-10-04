import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  BeforeInsert 
} from "typeorm";
import { AppDataSource } from "../../config/db";

@Entity()
export class Category {
  @PrimaryColumn()
  id!: string;   // <-- Will be V1001, V1002, etc.

  @Column()
  name!: string;

  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(Category);

    // Find last vendor
    const lastCity = await repo
      .createQueryBuilder("category")
      .orderBy("CAST(SUBSTRING(category.id, 4) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 101; // Start from CAT1001

    if (lastCity && lastCity.id) {
      const lastNumber = parseInt(lastCity.id.replace("CAT", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `CAT${nextNumber}`;
  }
}
