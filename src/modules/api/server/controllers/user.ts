import { Context } from "koa";
import { Authorized } from "~api/utils/validate-handler-authorization";
import { SetContextParam } from "~api/utils/validate-context-parameters";
import { Container } from "inversify";
import { UserListFilters as IUserListFilters, UserSortFields } from "~src/interfaces/entity/user";
import IDENTIFIERS from "~api/di/identifiers";
import { RequestBody } from "~src/interfaces/app/app";
import IUserRepository from "~api/interfaces/user-repository";
import { SortDirections } from "~src/interfaces/app/sort";

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: The API for operations with users
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           default: 146ecf32-65b0-491f-ba37-6270deffc34d
 *         name:
 *           type: string
 *           default: Company name
 *     UserDepartments:
 *       type: string
 *       enum: [DEVELOPER, HEAD, DESIGN ]
 *     UpdateMeRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           default: First name
 *         lastName:
 *           type: string
 *           default: Last name
 *         locale:
 *           type: string
 *           default: en
 *         timeZone:
 *           type: string
 *           default: Europe/Berlin
 *         department:
 *           $ref: '#/components/schemas/UserDepartments'
 *     UserResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/UpdateMeRequest'
 *         - type: object
 *           required:
 *             - id
 *             - avatarImageUrl
 *             - firstName
 *             - lastName
 *             - locale
 *             - timeZone
 *             - department
 *             - email
 *             - connectedWithCronofy
 *             - pauseMe
 *             - company
 *           properties:
 *             id:
 *               type: string
 *               default: 12345
 *             avatarImageUrl:
 *               type: string
 *               default: https://link-to-image-file.png
 *             email:
 *               type: string
 *               default: user@example.com
 *             connectedWithCronofy:
 *               type: boolean
 *               default: true
 *             pauseMe:
 *               type: boolean
 *               default: false
 *             company:
 *               $ref: '#/components/schemas/Company'
 */

export default class UserController {
  /**
   * @openapi
   * /users:
   *   get:
   *     summary: Retrieves a list of users
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/offsetParam'
   *       - $ref: '#/components/parameters/limitParam'
   *       - $ref: '#/components/parameters/sortKeyParam'
   *       - $ref: '#/components/parameters/sortDirectionParam'
   *       - name: filters
   *         in: query
   *         description: Specify filters to narrow down the list of users
   *         required: false
   *         schema:
   *           type: object
   *           properties:
   *             query:
   *               type: string
   *               description: Search for users based on a specific query
   *           example: {"query": "some name"}
   *     responses:
   *       200:
   *         description: Returns a successful response along with the list of users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   default: 200
   *                 data:
   *                   type: object
   *                   properties:
   *                     totalCount:
   *                       type: integer
   *                       description: Total number of users matching the filters
   *                     items:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Unauthorized - The user is not authorized to access this endpoint
   */
  @Authorized()
  public static async getList(@SetContextParam ctx: Context): Promise<void> {
    const { offset, limit, sortKey, sortDirection, ...filters } = ctx.request.query;

    const userRepository = (ctx.container as Container).get<IUserRepository>(IDENTIFIERS.USER_REPOSITORY);

    let pagination;
    let sort;

    if (offset && limit) {
      pagination = { offset: parseInt(offset as string), limit: parseInt(limit as string) };
    }

    if (sortKey && sortDirection) {
      sort = { field: sortKey as UserSortFields, direction: sortDirection as SortDirections };
    }

    ctx.body = {
      totalCount: await userRepository.getCount(ctx.context, filters as IUserListFilters),
      items: await userRepository.getList(ctx.context, filters as IUserListFilters, sort, pagination),
    };
    ctx.status = 200;
  }

  /**
   * @openapi
   * /users/me:
   *   get:
   *     summary: Retrieves the current user information
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successful response containing the current user information
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   default: 200
   *                 data:
   *                   $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Unauthorized - The user is not authorized to access this endpoint
   */
  @Authorized()
  public static async getMe(@SetContextParam ctx: Context): Promise<void> {
    ctx.body = ctx.context.user;
    ctx.status = 200;
  }

  /**
   * @openapi
   * /users/me:
   *   put:
   *     summary: Updates current user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              data:
   *                $ref: '#/components/schemas/UpdateMeRequest'
   *     responses:
   *       200:
   *         description: Successful response indicating that the current user was updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   default: 200
   *                 data:
   *                   $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Unauthorized - The user is not authorized to access this endpoint
   *       500:
   *         description: Internal server error occurred
   */
  @Authorized()
  public static async updateMe(@SetContextParam ctx: Context): Promise<void> {
    const { data } = ctx.request.body as RequestBody;

    const userRepository = (ctx.container as Container).get<IUserRepository>(IDENTIFIERS.USER_REPOSITORY);

    ctx.body = await userRepository.update(ctx.context.user.id, data);
    ctx.status = 200;
  }

  /**
   * @openapi
   * /users/pause-me:
   *   put:
   *     summary: Pause current user with meeting scheduling
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successful response indicating that the current user was paused successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   default: 200
   *                 data:
   *                   $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Unauthorized - The user is not authorized to access this endpoint
   *       500:
   *         description: Internal server error occurred
   */
  @Authorized()
  public static async pauseMe(@SetContextParam ctx: Context): Promise<void> {
    const userRepository = (ctx.container as Container).get<IUserRepository>(IDENTIFIERS.USER_REPOSITORY);

    ctx.body = await userRepository.setPause(ctx.context.user.id, true);
    ctx.status = 200;
  }

  /**
   * @openapi
   * /users/unpause-me:
   *   put:
   *     summary: Unpause current user with meeting scheduling
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successful response indicating that the current user was unpaused successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   default: 200
   *                 data:
   *                   $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Unauthorized - The user is not authorized to access this endpoint
   *       500:
   *         description: Internal server error occurred
   */
  @Authorized()
  public static async unpauseMe(@SetContextParam ctx: Context): Promise<void> {
    const userRepository = (ctx.container as Container).get<IUserRepository>(IDENTIFIERS.USER_REPOSITORY);

    ctx.body = await userRepository.setPause(ctx.context.user.id, false);
    ctx.status = 200;
  }

  /**
   * @openapi
   * /users/disconnect-from-cronofy:
   *   put:
   *     summary: Disconnect current user from cronofy
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successful response indicating that the current user was disconnected successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   default: 200
   *                 data:
   *                   $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Unauthorized - The user is not authorized to access this endpoint
   *       500:
   *         description: Internal server error occurred
   */
  @Authorized()
  public static async disconnectFromCronofy(@SetContextParam ctx: Context): Promise<void> {
    const userRepository = (ctx.container as Container).get<IUserRepository>(IDENTIFIERS.USER_REPOSITORY);

    ctx.body = await userRepository.disconnectFromCronofy(ctx.context.user.id);
    ctx.status = 200;
  }
}
