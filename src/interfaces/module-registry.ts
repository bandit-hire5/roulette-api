export default interface ModuleRegistry {
  register(name: string): void;
  getList(): string[];
}
