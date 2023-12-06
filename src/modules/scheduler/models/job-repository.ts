import { inject, injectable } from "inversify";
import { Repository, ObjectType, LessThan, EntityManager } from "typeorm";
import IJob, { JobStatuses, JobData as IJobData } from "~src/interfaces/entity/job";
import Job from "~src/entities/job/job";
import IJobRepository from "~scheduler/interfaces/job-repository";
import { ERRORS } from "~src/interfaces/app/app";
import AppError from "~src/models/error";
import IDENTIFIERS from "~src/di/identifiers";
import { assert } from "~src/utils/validate";
import { getUnixTimestampFromDate, addSecondsToDate } from "~src/utils/date";
import { JOB_EXECUTE_TIME_EXPIRE_SECONDS } from "~scheduler/constants";
import GLOBAL_IDENTIFIERS from "~src/di/identifiers";
import IObserver from "~src/interfaces/observer";

@injectable()
export default class JobRepository implements IJobRepository {
  @inject(IDENTIFIERS.DB_DATA_REPOSITORY) getDbDataRepository: (entity: ObjectType<IJob>) => Repository<Job>;
  @inject(GLOBAL_IDENTIFIERS.EVENT_OBSERVER)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  observer: IObserver<any>;
  @inject(IDENTIFIERS.ENTITY_MANAGER) getEntityManager: () => EntityManager;

  protected get entityManager(): EntityManager {
    return this.getEntityManager();
  }

  protected get jobDbRepository(): Repository<Job> {
    return this.getDbDataRepository(Job) as Repository<Job>;
  }

  public getList(): Promise<IJob[]> {
    return this.jobDbRepository.find({
      where: {
        scheduleOn: LessThan(getUnixTimestampFromDate(addSecondsToDate(new Date(), JOB_EXECUTE_TIME_EXPIRE_SECONDS))),
        status: JobStatuses.active,
      },
    });
  }

  public async activateList(): Promise<void> {
    await this.entityManager.query(`update job set status = ? where status = ?`, [
      JobStatuses.active,
      JobStatuses.blocked,
    ]);
  }

  public async create(data: IJobData, uniqueHash: string, scheduleOn: number, repeatInSeconds: number): Promise<IJob> {
    const existedJob = await this.jobDbRepository.findOne({
      where: {
        uniqueHash,
      },
    });

    if (existedJob) {
      return existedJob;
    }

    const job = this.jobDbRepository.create({
      data,
      uniqueHash,
      scheduleOn,
      repeatInSeconds,
      status: JobStatuses.active,
    });

    await assert(job);

    return this.jobDbRepository.save(job);
  }

  public async remove(id: string): Promise<void> {
    await this.jobDbRepository.delete(id);
  }

  public async getJobByHash(uniqueHash: string): Promise<IJob> {
    const job = await this.jobDbRepository.findOne({ uniqueHash });

    if (!job) {
      throw new AppError(ERRORS.NO_SUCH_ENTITY, "Job doesn't exist");
    }

    return job;
  }

  public async start(job: Job): Promise<void> {
    this.jobDbRepository.merge(job, { status: JobStatuses.blocked });

    await this.jobDbRepository.save(job);

    console.log("Start job", JSON.stringify({ job }));
  }

  private async end(job: IJob): Promise<void> {
    console.log("End job", JSON.stringify({ job }));

    if (!job.repeatInSeconds) {
      await this.jobDbRepository.delete(job.id);

      console.log("Job was removed", JSON.stringify({ job }));

      return;
    }

    job.scheduleOn += job.repeatInSeconds;
    job.status = JobStatuses.active;

    await this.jobDbRepository.save(job);

    console.log("Job was rescheduled", JSON.stringify({ job }));
  }

  private async error(job: IJob, error: AppError): Promise<void> {
    console.error(new Date(), error, JSON.stringify({ job }));

    if (job.repeatInSeconds) {
      job.scheduleOn += job.repeatInSeconds;
      job.status = JobStatuses.active;

      await this.jobDbRepository.save(job);

      console.log("Job was rescheduled", JSON.stringify({ job }));

      return;
    }

    await this.jobDbRepository.delete(job.id);

    console.log("Job was removed", JSON.stringify({ job }));
  }

  public async runJob(job: IJob): Promise<void> {
    const { data } = job;

    try {
      await this.observer.broadcast(data);

      await this.end(job);
    } catch (e) {
      await this.error(job, e);
    }
  }
}
