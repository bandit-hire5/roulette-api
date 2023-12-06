import { interfaces } from "inversify";

export interface Module {
  initialize?(container: interfaces.Container): Promise<void>;
  run(): Promise<void>;
}

export enum NAMES {
  API = "api",
  SCHEDULER = "scheduler",
}

export interface ModuleFilters {
  readonly names?: string[];
}
