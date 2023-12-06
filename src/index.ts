#!/usr/bin/env node

import dotenv from "dotenv";

dotenv.config();

import container from "./di";
import IDENTIFIERS from "./di/identifiers";
import IScript, {
  ServiceActivity as IServiceActivity,
  ServiceDeclaration as IServiceDeclaration,
} from "~src/interfaces/script";
import argv from "minimist";

const getArgs = (): { [key: string]: string } => argv(process.argv.slice(2));

function getRequestedToRunActivities(service: IServiceDeclaration): IServiceActivity[] {
  const args = getArgs();

  if (args.service !== service.name) {
    return [];
  }

  return service.activities.filter(({ name }) => name === args.activity);
}

function runServiceActivities(service: IServiceDeclaration): void {
  const activities = getRequestedToRunActivities(service);

  for (const activity of activities) {
    // TODO move to logger service
    console.log(`Activity \`${activity.name}\` of service \`${service.name}\` started.`);

    activity.start.run(getArgs());
  }
}

runServiceActivities({
  name: "roulette-api",
  activities: [
    {
      name: "start",
      start: container.get<IScript>(IDENTIFIERS.START_SCRIPT),
    },
    {
      name: "migrations",
      start: container.get<IScript>(IDENTIFIERS.MIGRATION_SCRIPT),
    },
    {
      name: "special-migrations",
      start: container.get<IScript>(IDENTIFIERS.SPECIAL_MIGRATION_SCRIPT),
    },
  ],
});
