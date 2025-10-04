// src/entities/Pincode.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from "typeorm";
import { AppDataSource } from "../../config/db";
import { City } from "./city";
import { State } from "./state";
import { Country } from "./country";


@Entity()
export class Pincode {
  @PrimaryColumn()
  id!: string; // e.g., PIN1001

  @Column()
  code!: string; // actual pincode number, e.g., "600001"

  @ManyToOne(() => City, { onDelete: "CASCADE" })
  @JoinColumn({ name: "city_id" })
  city!: City;

  @ManyToOne(() => State, { onDelete: "CASCADE" })
  @JoinColumn({ name: "state_id" })
  state!: State;

  @ManyToOne(() => Country, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_id" })
  country!: Country;

  @BeforeInsert()
  async generateId() {
    const repo = AppDataSource.getRepository(Pincode);

    const last = await repo
      .createQueryBuilder("pincode")
      .orderBy("CAST(SUBSTRING(pincode.id, 4) AS UNSIGNED)", "DESC")
      .getOne();

    let nextNumber = 1001;
    if (last && last.id) {
      const lastNumber = parseInt(last.id.replace("PIN", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.id = `PIN${nextNumber}`;
  }
}
