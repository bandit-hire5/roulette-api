import { Entity, PrimaryGeneratedColumn, Column, Index, VersionColumn } from "typeorm";
import IJob, { JobStatuses, JobData as IJobData } from "~src/interfaces/entity/job";

@Entity()
export default class Job implements IJob {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @VersionColumn({ default: 0 })
  version: number;

  @Column()
  status: JobStatuses;

  @Column()
  @Index({ unique: true })
  uniqueHash: string;

  @Column()
  scheduleOn: number;

  @Column({ default: 0 })
  repeatInSeconds: number;

  @Column("simple-json")
  data: IJobData;
}
