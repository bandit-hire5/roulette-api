import IJob, { JobData as IJobData } from "~src/interfaces/entity/job";

export default interface JobRepository {
  getList(): Promise<IJob[]>;

  activateList(): Promise<void>;

  create(data: IJobData, uniqueHash: string, scheduleOn: number, repeatInSeconds: number): Promise<IJob>;

  remove(id: string): Promise<void>;

  getJobByHash(hash: string): Promise<IJob>;

  start(job: IJob): Promise<void>;

  runJob(job: IJob): Promise<void>;
}
