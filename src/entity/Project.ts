import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Project {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

  @Column("bigint", { nullable: true })
  price: number | null;

  @Column({ nullable: true })
  royalties: number | null;

  @Column({ nullable: true })
  enabled: boolean;
}
