import { ObserverTypes } from "~src/interfaces/observer";

export interface JobData {
  readonly type: ObserverTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: any;
}

export default interface Job {
  id: string;
  status: JobStatuses;
  uniqueHash: string;
  scheduleOn: number;
  repeatInSeconds: number;
  data: JobData;
}

export enum JobStatuses {
  active = "active",
  blocked = "blocked",
}
