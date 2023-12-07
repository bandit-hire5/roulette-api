import KoaRouter from "koa-router";

/**
 * @openapi
 * components:
 *   parameters:
 *     idParam:
 *       name: id
 *       in: path
 *       description: The id of current entity
 *       required: true
 *       schema:
 *         type: string
 *     offsetParam:
 *       name: offset
 *       in: query
 *       description: Number of items to skip before returning the results
 *       required: false
 *       schema:
 *         type: integer
 *         format: int32
 *         minimum: 0
 *         default: 0
 *     limitParam:
 *       name: limit
 *       in: query
 *       description: Maximum number of items to return
 *       required: false
 *       schema:
 *         type: integer
 *         format: int32
 *         minimum: 1
 *         maximum: 100
 *         default: 20
 *     sortKeyParam:
 *       name: sortKey
 *       in: query
 *       description: The key for sorting items
 *       required: false
 *       schema:
 *         type: string
 *         default:
 *     sortDirectionParam:
 *       name: sortDirection
 *       in: query
 *       description: The direction for sorting items
 *       required: false
 *       schema:
 *         type: string
 *         enum: [ASC, DESC]
 *         default: ASC
 */

import userBuilder from "./user";
import rouletteBuilder from "./roulette";

const APIRouter = new KoaRouter({
  prefix: "/v1",
});

APIRouter.use(userBuilder.routes());
APIRouter.use(rouletteBuilder.routes());

export default APIRouter;
