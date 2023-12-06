import { injectable } from "inversify";
import IModuleRegistry from "~src/interfaces/module-registry";

@injectable()
export default class ModuleRegistry implements IModuleRegistry {
  private registry = new Set<string>();

  public register(name: string): void {
    this.registry.add(name);
  }

  public getList(): string[] {
    return Array.from<string>(this.registry.values());
  }
}
