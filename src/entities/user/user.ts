import { Entity, Column, ManyToOne } from "typeorm";
import IUser from "~src/interfaces/entity/user";
import IBase from "~src/interfaces/app/base";
import Base from "../base";
import Company from "~src/entities/company/company";
import { IsEmail, IsOptional } from "class-validator";

@Entity()
export default class User extends Base implements IBase, IUser {
  @Column({ unique: true, nullable: true })
  externalId: string;

  @Column({ unique: true, nullable: true })
  @IsOptional()
  @IsEmail()
  email: string;

  @Column({ default: "" })
  department: string;

  @Column({ length: 2, default: "" })
  locale: string;

  @Column({ default: "" })
  timeZone: string;

  @Column({ default: "" })
  firstName: string;

  @Column({ default: "" })
  lastName: string;

  @Column({ default: "" })
  avatarImageUrl: string;

  @ManyToOne(() => Company, (company: Company) => company.users, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  company: Company;
}
