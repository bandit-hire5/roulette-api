import { PrimaryGeneratedColumn, VersionColumn } from "typeorm";

export default class Base {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @VersionColumn({ default: 0 })
  version: number;
}
