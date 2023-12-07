export default interface CronofyClient {
  getToken(code: string): Promise<GetTokenResponse>;
  getUserInfo(refreshToken: string): Promise<any>;
  listCalendars(refreshToken: string): Promise<ListCalendarsResponse>;
  availability(refreshToken: string, data: AvailabilityRequestData): Promise<AvailabilityResponse>;
  createEvent(refreshToken: string, calendarId: string, data: CreateEventRequestData): Promise<void>;
}

export interface CronofyClientOptions {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly dataCenter: string;
  readonly redirectURI: string;
}

export interface GetTokenResponse {
  readonly access_token: string;
  readonly refresh_token: string;
  readonly scope: string;
  readonly sub: string;
}

export interface AvailabilityResponse {
  readonly available_periods: Period[];
}

export interface ListCalendarsResponse {
  readonly calendars: Calendar[];
}

export interface AvailabilityRequestData {
  readonly duration: { minutes: number };
  readonly buffer: { before: { minutes: number }; after: { minutes: number } };
  readonly queryPeriods: Period[];
  readonly members: Member[];
}

export interface CreateEventRequestData {
  readonly event: {
    readonly event_id: string;
    readonly summary: string;
    readonly description: string;
  };
  readonly period: Period;
  readonly attendees: Attendee[];
}

export interface Attendee {
  readonly email: string;
  readonly displayName: string;
}

export interface Period {
  readonly start: string;
  readonly end: string;
}

export interface Member {
  readonly email: string;
  readonly name: string;
  readonly sub: string;
  readonly refreshToken: string;
  readonly calendar_ids: string[];
}

export interface Calendar {
  readonly provider_name: string;
  readonly profile_id: string;
  readonly profile_name: string;
  readonly calendar_id: string;
  readonly calendar_name: string;
  readonly calendar_readonly: boolean;
  readonly calendar_deleted: boolean;
  readonly calendar_primary: boolean;
  readonly calendar_integrated_conferencing_available: boolean;
  readonly calendar_attachments_available: boolean;
}
