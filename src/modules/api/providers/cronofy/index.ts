// eslint-disable-next-line @typescript-eslint/no-var-requires
const Cronofy = require("cronofy");
import { injectable } from "inversify";
import ICronofyClient, {
  CronofyClientOptions as ICronofyClientOptions,
  GetTokenResponse as IGetTokenResponse,
  AvailabilityRequestData as IAvailabilityRequestData,
  CreateEventRequestData as ICreateEventRequestData,
  ListCalendarsResponse as IListCalendarsResponse,
  AvailabilityResponse as IAvailabilityResponse,
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

  private async refreshToken(refreshToken: string): Promise<string> {
    const { access_token } = await this.client.refreshAccessToken({
      refresh_token: refreshToken,
    });

    return access_token;
  }

  getToken(code: string): Promise<IGetTokenResponse> {
    return this.client.requestAccessToken({
      code,
      redirect_uri: this.options.redirectURI,
    });
  }

  async getUserInfo(refreshToken: string): Promise<any> {
    return this.client.userInfo({
      access_token: await this.refreshToken(refreshToken),
    });
  }

  async listCalendars(refreshToken: string): Promise<IListCalendarsResponse> {
    return this.client.listCalendars({
      access_token: await this.refreshToken(refreshToken),
    });
  }

  async availability(refreshToken: string, data: IAvailabilityRequestData): Promise<IAvailabilityResponse> {
    return this.client.availability({
      access_token: await this.refreshToken(refreshToken),
      participants: [
        {
          members: data.members,
          required: "all",
        },
      ],
      required_duration: data.duration,
      query_periods: data.queryPeriods,
      buffer: data.buffer,
    });
  }

  async createEvent(refreshToken: string, calendarId: string, data: ICreateEventRequestData): Promise<void> {
    await this.client.createEvent({
      access_token: await this.refreshToken(refreshToken),
      calendar_id: calendarId,
      conferencing: {
        profile_id: "default",
      },
      ...data.event,
      ...data.period,
      attendees: {
        invite: data.attendees,
        required: "all",
      },
    });
  }
}
