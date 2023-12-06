export interface ObserverData<TData> {
  readonly type: ObserverTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: TData;
}

export default interface Observer<TData> {
  subscribe(fn: (data: ObserverData<TData>) => Promise<void>): void;
  unsubscribe(fn: (data: ObserverData<TData>) => Promise<void>): void;
  broadcast(data: ObserverData<TData>): Promise<void>;
}

export enum ObserverTypes {
  WorkerMessage = "WorkerMessage",
}
