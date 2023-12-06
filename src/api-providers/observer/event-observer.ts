import { injectable } from "inversify";
import IObserver, { ObserverData as IObserverData } from "~src/interfaces/observer";

@injectable()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class EventObserver<TData extends IObserverData<any>> implements IObserver<TData> {
  private observers: ((data: TData) => Promise<void>)[] = [];

  subscribe(fn: (data: TData) => Promise<void>): void {
    this.observers.push(fn);
  }

  unsubscribe(fn: (data: TData) => Promise<void>): void {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  async broadcast(data: TData): Promise<void> {
    await Promise.all(this.observers.map(async (subscriber) => await subscriber(data)));
  }
}
