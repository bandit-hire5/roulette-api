export enum WorkerMessages {
  TEST = "TEST",
}

export interface WorkerMessage {
  readonly type: WorkerMessages;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data?: any;
}
