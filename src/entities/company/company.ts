import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ValidateNested } from "class-validator";
import ICompany from "~src/interfaces/entity/company";
import User from "~src/entities/user/user";

@Entity()
export default class Company implements ICompany {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => User, (user: User) => user.company, {
    eager: false,
    cascade: true,
  })
  @ValidateNested()
  users: User[];
}
