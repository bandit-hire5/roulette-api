import { inject, injectable } from "inversify";
import schedule from "node-schedule";
import IScript from "~src/interfaces/script";
import IJobRepository from "~scheduler/interfaces/job-repository";
import { JOB_EXECUTE_TIME_AFTER_MIN_SECONDS, RUN_DEFAULT_JOB_PERIOD } from "~scheduler/constants";
import IDENTIFIERS from "~scheduler/di/identifiers";
import { scheduleDateByTimestamp } from "~src/utils/date";

@injectable()
export default class StartScript implements IScript {
  @inject(IDENTIFIERS.JOB_REPOSITORY) jobRepository: IJobRepository;

  protected async runDefaultJob(): Promise<void> {
    const jobList = await this.jobRepository.getList();

    if (!jobList.length) {
      return;
    }

    for (const job of jobList) {
      try {
        await this.jobRepository.start(job);

        schedule.scheduleJob(
          scheduleDateByTimestamp(job.scheduleOn, JOB_EXECUTE_TIME_AFTER_MIN_SECONDS),
          this.jobRepository.runJob.bind(this.jobRepository, job)
        );
      } catch (e) {
        // NOP just ignore the error
      }
    }
  }

  protected async activateJobs(): Promise<void> {
    return this.jobRepository.activateList();
  }

  protected async createPrefilledJobs(): Promise<void> {
    await Promise.all(
      [].map(async ({ uniqueHash, scheduleOn, repeatInSeconds, data }) =>
        this.jobRepository.create(data, uniqueHash, scheduleOn, repeatInSeconds)
      )
    );
  }

  public async run(): Promise<void> {
    await this.createPrefilledJobs();
    await this.activateJobs();

    schedule.scheduleJob(RUN_DEFAULT_JOB_PERIOD, this.runDefaultJob.bind(this));
  }
}
