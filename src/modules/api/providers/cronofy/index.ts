// eslint-disable-next-line @typescript-eslint/no-var-requires
const Cronofy = require("cronofy");
import { injectable } from "inversify";
import ICronofyClient, {
  CronofyClientOptions as ICronofyClientOptions,
  GetTokenResponse as IGetTokenResponse,
} from "~api/interfaces/providers/cronofy";
import { CRONOFY_CLIENT_ID, CRONOFY_CLIENT_SECRET, CRONOFY_DATA_CENTER, CRONOFY_REDIRECT_URI } from "~api/constants";

@injectable()
export default class CronofyClient implements ICronofyClient {
  constructor(
    private options: ICronofyClientOptions = {
      clientId: CRONOFY_CLIENT_ID,
      clientSecret: CRONOFY_CLIENT_SECRET,
      dataCenter: CRONOFY_DATA_CENTER,
      redirectURI: CRONOFY_REDIRECT_URI,
    },
    private client = new Cronofy({
      client_id: options.clientId,
      client_secret: options.clientSecret,
      data_center: options.dataCenter,
    })
  ) {}

  getToken(code: string): Promise<IGetTokenResponse> {
    return this.client.requestAccessToken({
      code,
      redirect_uri: this.options.redirectURI,
    });
  }
}
