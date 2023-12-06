import { Module as IModule, ModuleFilters as IModuleFilters } from "~src/interfaces/module";

export default interface ModuleRepository {
  get(name: string): IModule;

  initialize(filters?: IModuleFilters): Promise<void>;

  run(filters?: IModuleFilters): Promise<void>;
}
