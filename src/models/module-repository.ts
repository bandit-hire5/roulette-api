import { inject, injectable, interfaces } from "inversify";
import IModuleRepository from "~src/interfaces/module-repository";
import IModuleRegistry from "~src/interfaces/module-registry";
import { Module as IModule, ModuleFilters as IModuleFilters } from "~src/interfaces/module";
import IDENTIFIERS from "~src/di/identifiers";
import container from "~src/di";

@injectable()
export default class ModuleRepository implements IModuleRepository {
  @inject(IDENTIFIERS.MODULE_REGISTRY) registry: IModuleRegistry;
  @inject(IDENTIFIERS.MODULE_FACTORY) moduleFactory: interfaces.Factory<IModule>;

  public get(name: string): IModule {
    return this.moduleFactory(name) as IModule;
  }

  private getList(filters: IModuleFilters): IModule[] {
    let list = this.registry.getList();

    if (filters.names?.length) {
      list = list.filter((name) => filters.names.includes(name));
    }

    return list.map((name) => this.get(name));
  }

  public async initialize(filters: IModuleFilters = {}): Promise<void> {
    for (const module of this.getList(filters)) {
      if (module.initialize) {
        await module.initialize(container);
      }
    }
  }

  public async run(filters: IModuleFilters = {}): Promise<void> {
    for (const module of this.getList(filters)) {
      await module.run();
    }
  }
}
