import { injectable, Container } from "inversify";
import jwksClient, { JwksClient } from "jwks-rsa";
import IScript from "~src/interfaces/script";
import { NAMES, Module as IModule } from "~src/interfaces/module";
import ServerScript from "./scripts/server";
import IDENTIFIERS from "./di/identifiers";
import IIDPClient from "~api/interfaces/providers/idp";
import IDPClient from "~api/providers/idp";
import IUserRepository from "~api/interfaces/user-repository";
import UserRepository from "~api/models/user-repository";
import { API_SOFTGARDEN_WELL_KNOWN_ROUTE } from "~api/constants";
import ICompanyRepository from "~api/interfaces/company-repository";
import CompanyRepository from "~api/models/company-repository";
import ICronofyClient from "~api/interfaces/providers/cronofy";
import CronofyClient from "~api/providers/cronofy";

@injectable()
export default class ApiModule implements IModule {
  public static moduleName = NAMES.API;

  private runScript: IScript;

  async initialize(container: Container): Promise<void> {
    container.bind<IScript>(IDENTIFIERS.API_RUN_SCRIPT).to(ServerScript).inSingletonScope();

    container.bind<IIDPClient>(IDENTIFIERS.IDP_CLIENT).to(IDPClient).inSingletonScope();

    container.bind<ICompanyRepository>(IDENTIFIERS.COMPANY_REPOSITORY).to(CompanyRepository).inSingletonScope();

    container.bind<IUserRepository>(IDENTIFIERS.USER_REPOSITORY).to(UserRepository).inSingletonScope();

    container.bind<ICronofyClient>(IDENTIFIERS.CRONOFY_CLIENT).to(CronofyClient);

    container
      .bind<JwksClient>(IDENTIFIERS.JWKS_CLIENT)
      .toConstantValue(jwksClient({ jwksUri: API_SOFTGARDEN_WELL_KNOWN_ROUTE }));

    this.runScript = container.get<IScript>(IDENTIFIERS.API_RUN_SCRIPT);
  }

  async run(): Promise<void> {
    await this.runScript.run();
  }
}
