import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class UserOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  age!: number;
}
