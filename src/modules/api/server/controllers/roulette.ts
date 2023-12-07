import { Context } from "koa";
import { v4 as generateId } from "uuid";
import { Authorized } from "~api/utils/validate-handler-authorization";
import { SetContextParam } from "~api/utils/validate-context-parameters";
import { Container } from "inversify";
import IDENTIFIERS from "~api/di/identifiers";
import IUserRepository from "~api/interfaces/user-repository";
import ICronofyClient, { Member as IMember, Period as IPeriod } from "~api/interfaces/providers/cronofy";
import { getCalendar, getQueryPeriods } from "~api/utils/cronofy";
import {
  CRONOFY_DEFAULT_BUFFER_AFTER_DURATION,
  CRONOFY_DEFAULT_BUFFER_BEFORE_DURATION,
  CRONOFY_DEFAULT_MEETING_DURATION,
} from "~api/constants";
import { getNextWorkingDay } from "~src/utils/date";

/**
 * @openapi
 * tags:
 *   name: Roulette
 *   description: The API for triggering roulette
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - summary
 *         - description
 *         - start
 *         - end
 *       properties:
 *         summary:
 *           type: string
 *           default: Coffee meeting
 *         description:
 *           type: string
 *           default: Meet a colleague
 *         start:
 *           type: string
 *           default: 2023-12-08T12:00:00Z
 *         end:
 *           type: string
 *           default: 2023-12-08T12:30:00Z
 *     StartRouletteResponse:
 *       type: object
 *       required:
 *         - event
 *         - participants
 *       properties:
 *         event:
 *           $ref: '#/components/schemas/Event'
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserResponse'
 */

export default class RouletteController {
  /**
   * @openapi
   * /roulette/trigger:
   *   post:
   *     summary: Start roulette
   *     tags: [Roulette]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successful response containing the roulette data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   default: 200
   *                 data:
   *                   $ref: '#/components/schemas/StartRouletteResponse'
   *       401:
   *         description: Unauthorized - The user is not authorized to access this endpoint
   */
  @Authorized()
  public static async start(@SetContextParam ctx: Context): Promise<void> {
    const { user } = ctx.context;

    const userRepository = (ctx.container as Container).get<IUserRepository>(IDENTIFIERS.USER_REPOSITORY);
    const cronofyClient = (ctx.container as Container).get<ICronofyClient>(IDENTIFIERS.CRONOFY_CLIENT);

    const participants = await userRepository.getRandomEventParticipants(ctx.context);

    const members: IMember[] = [];

    for (const participant of participants) {
      const { calendars } = await cronofyClient.listCalendars(participant.cronofy.refreshToken);

      const calendar = getCalendar(calendars);

      members.push({
        email: calendar.profile_name,
        name: `${participant.firstName} ${participant.lastName}`,
        sub: participant.cronofy.sub,
        refreshToken: participant.cronofy.refreshToken,
        calendar_ids: [calendar.calendar_id],
      });
    }

    let i = 0;
    let date = new Date();
    let period: IPeriod;

    while (true) {
      const nextDay = getNextWorkingDay(date);

      const data = await cronofyClient.availability(user.cronofy.refreshToken, {
        duration: { minutes: CRONOFY_DEFAULT_MEETING_DURATION },
        buffer: {
          before: { minutes: CRONOFY_DEFAULT_BUFFER_BEFORE_DURATION },
          after: { minutes: CRONOFY_DEFAULT_BUFFER_AFTER_DURATION },
        },
        queryPeriods: getQueryPeriods(nextDay),
        members,
      });

      if (data?.available_periods?.length) {
        [period] = data.available_periods;

        break;
      }

      if (i >= 7) {
        break;
      }

      date = nextDay;
      i++;
    }

    const [member] = members;
    const [calendarId] = member.calendar_ids;

    const data = {
      event: {
        event_id: generateId(),
        summary: "Coffee meeting",
        description: "have fun with your colleague",
      },
      period,
      attendees: members.map(({ email, name }) => ({ email, displayName: name })),
    };

    //await cronofyClient.createEvent(member.refreshToken, calendarId, data);

    ctx.body = {
      event: {
        summary: data.event.summary,
        description: data.event.description,
        start: data.period.start,
        end: data.period.end,
      },
      participants,
    };
    ctx.status = 200;
  }
}
