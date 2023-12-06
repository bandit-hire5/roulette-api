/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, interfaces } from "inversify";
import getDecorators from "inversify-inject-decorators";

const container = new Container();

const { lazyInject } = getDecorators(container);

import IScript from "~src/interfaces/script";

import { getRepository, getManager, Repository, ObjectType, EntityManager } from "typeorm";

import { getModuleIdentifier } from "~src/utils/module";
import { Module as IModule } from "~src/interfaces/module";
import modules from "~src/modules";

import StartScript from "~src/scripts/start";
import MigrationScript from "~src/scripts/migration";
import SpecialMigrationScript from "~src/scripts/special-migration";

import IModuleRegistry from "~src/interfaces/module-registry";
import ModuleRegistry from "~src/models/module-registry";

import IModuleRepository from "~src/interfaces/module-repository";
import ModuleRepository from "~src/models/module-repository";

import IDENTIFIERS from "./identifiers";
import IObserver, { ObserverData as IObserverData } from "~src/interfaces/observer";

import EventObserver from "~src/api-providers/observer/event-observer";

container.bind<IModuleRepository>(IDENTIFIERS.MODULE_REPOSITORY).to(ModuleRepository).inSingletonScope();

container.bind<IModuleRegistry>(IDENTIFIERS.MODULE_REGISTRY).to(ModuleRegistry).inSingletonScope();

container.bind<interfaces.Factory<IModule>>(IDENTIFIERS.MODULE_FACTORY).toFactory<IModule>(
  (context: interfaces.Context) =>
    (module: string): IModule =>
      context.container.get(getModuleIdentifier(module))
);

const moduleRegistry = container.get<IModuleRegistry>(IDENTIFIERS.MODULE_REGISTRY);
for (const module of modules) {
  container.bind<IModule>(getModuleIdentifier(module.moduleName)).to(module).inSingletonScope();

  moduleRegistry.register(module.moduleName);
}

container.bind<IScript>(IDENTIFIERS.START_SCRIPT).to(StartScript).inSingletonScope();

container.bind<IScript>(IDENTIFIERS.MIGRATION_SCRIPT).to(MigrationScript).inSingletonScope();

container.bind<IScript>(IDENTIFIERS.SPECIAL_MIGRATION_SCRIPT).to(SpecialMigrationScript).inSingletonScope();

container
  .bind<(entity: ObjectType<any>) => Repository<any>>(IDENTIFIERS.DB_DATA_REPOSITORY)
  .toConstantValue(getRepository);

container.bind<() => EntityManager>(IDENTIFIERS.ENTITY_MANAGER).toConstantValue(getManager);

container.bind<IObserver<IObserverData<any>>>(IDENTIFIERS.EVENT_OBSERVER).to(EventObserver).inSingletonScope();

export default container;

export { lazyInject };
