import { injectable, Container } from "inversify";
import { NAMES, Module as IModule } from "~src/interfaces/module";
import IDENTIFIERS from "./di/identifiers";
import IScript from "~src/interfaces/script";
import StartScript from "~scheduler/scripts/start";
import IJobRepository from "~scheduler/interfaces/job-repository";
import JobRepository from "~scheduler/models/job-repository";

@injectable()
export default class SchedulerModule implements IModule {
  public static moduleName = NAMES.SCHEDULER;

  private runScript: IScript;

  async initialize(container: Container): Promise<void> {
    container.bind<IScript>(IDENTIFIERS.SCHEDULER_RUN_SCRIPT).to(StartScript).inSingletonScope();

    container.bind<IJobRepository>(IDENTIFIERS.JOB_REPOSITORY).to(JobRepository).inSingletonScope();

    this.runScript = container.get<IScript>(IDENTIFIERS.SCHEDULER_RUN_SCRIPT);
  }

  async run(): Promise<void> {
    this.runScript.run();
  }
}
