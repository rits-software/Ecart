import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// Define user roles as enum
export enum Role {
  USER = "user",
  VENDOR = "vendor",
  ADMIN = "admin",
}

@Entity("users") // optional table name
export class User {
  @PrimaryGeneratedColumn() // auto-increment primary key
  id!: number;

  @Column({ type: "varchar", unique: true, length: 255 })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER,
  })
  role!: Role;
}
