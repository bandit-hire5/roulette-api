import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import ICronofy from "~src/interfaces/entity/cronofy";
import IBase from "~src/interfaces/app/base";
import Base from "../base";
import User from "~src/entities/user/user";

@Entity()
export default class Cronofy extends Base implements IBase, ICronofy {
  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  scope: string;

  @Column()
  sub: string;

  @OneToOne(() => User, (user: User) => user.cronofy, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn()
  user: User;
}
