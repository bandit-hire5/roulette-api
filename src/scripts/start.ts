// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Worker } = require("worker_threads");
import fs from "fs";
import { injectable, inject } from "inversify";
import IScript from "~src/interfaces/script";
import { NAMES } from "~src/interfaces/module";
import { establishConnection } from "~src/api-providers/provider";
import IModuleRepository from "~src/interfaces/module-repository";
import IDENTIFIERS from "~src/di/identifiers";
import { WORKERS_FOLDER } from "~src/constants";
import IObserver, { ObserverTypes } from "~src/interfaces/observer";
import { WorkerMessage as IWorkerMessage } from "~src/interfaces/worker";

@injectable()
export default class StartScript implements IScript {
  @inject(IDENTIFIERS.MODULE_REPOSITORY) moduleRepository: IModuleRepository;
  @inject(IDENTIFIERS.EVENT_OBSERVER) observer: IObserver<IWorkerMessage>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private workers: { [key: string]: any } = {};

  protected async runWorker(file: string, data: { [key: string]: number | string }): Promise<void> {
    const worker = new Worker(`${WORKERS_FOLDER}/${file}`, { workerData: data });

    worker.on("error", async (err: Error) => {
      console.error(new Date(), `Error: ${err.message} in worker: ${file}`);
    });

    worker.on("exit", async () => {
      delete this.workers[file];

      console.error(new Date(), "Worker was exited: file");

      this.workers[file] = await this.runWorker(file, data);

      console.log(`Worker was restarted: ${file}`);
    });

    return worker;
  }

  protected async registerEvents(): Promise<void> {
    this.observer.subscribe(async ({ type, data }) => {
      if (type !== ObserverTypes.WorkerMessage) {
        return;
      }

      for (const file of Object.keys(this.workers)) {
        this.workers[file].postMessage(data);
      }
    });
  }

  public async run(): Promise<void> {
    await Promise.all([establishConnection()]);

    const files = fs.readdirSync(WORKERS_FOLDER).filter((file) => /\.js$/.test(file));

    for (const file of files) {
      this.workers[file] = await this.runWorker(file, { name: file });

      console.log(`Worker was created: ${file}`);
    }

    const filters = { names: [NAMES.API] };

    await this.moduleRepository.initialize(filters);
    await this.moduleRepository.run(filters);

    await this.registerEvents();
  }
}
