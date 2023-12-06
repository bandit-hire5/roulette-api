export interface ScriptArgs {
  [key: string]: string;
}

export default interface Script {
  run(args?: ScriptArgs): void | Promise<void>;
}

export interface ServiceActivity {
  name: string;
  start: Script;
}

export interface ServiceDeclaration {
  name: string;
  activities: ServiceActivity[];
}
