import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Project } from "./Project";

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  alias: string | null;
}
