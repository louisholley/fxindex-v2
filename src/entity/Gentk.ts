import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

@Entity()
export class Gentk {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Project)
  @JoinColumn()
  project: Project;

  @ManyToOne(() => User)
  @JoinColumn()
  minter: User;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @Column("simple-json")
  metadata: any;

  @Column()
  iteration: number;

  @Column()
  royalties: number;
}
