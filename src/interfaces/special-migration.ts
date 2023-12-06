export default interface SpecialMigration {
  run(): Promise<void>;
}
