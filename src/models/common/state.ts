import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  BeforeInsert 
} from "typeorm";
import { AppDataSource } from "../../config/db";

@Entity()
export class State {
  @PrimaryColumn()
  id!: string;   // <-- Will be V1001, V1002, etc.

  @Column()
  name!: string;

  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(State);

    // Find last state
    const lastState = await repo
      .createQueryBuilder("state")
      .orderBy("CAST(SUBSTRING(state.id, 3) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001; // Start from CI1001

    if (lastState && lastState.id) {
      const lastNumber = parseInt(lastState.id.replace("SI", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `SI${nextNumber}`;
  }
}
