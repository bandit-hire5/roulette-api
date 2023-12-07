import { Context, Next } from "koa";
import { Container } from "inversify";
import { JwksClient } from "jwks-rsa";
import jwt from "jsonwebtoken";
import { UserFull as IUserFull } from "~src/interfaces/entity/user";
import ICompany from "~src/interfaces/entity/company";
import ICompanyRepository from "~api/interfaces/company-repository";
import IUserRepository from "~api/interfaces/user-repository";
import IDENTIFIERS from "~api/di/identifiers";
import IIDPClient from "~api/interfaces/providers/idp";
import { SSO_AUDIENCE } from "~api/constants";
import { DEFAULT_COMPANY_ID, DEFAULT_USER_EMAIL } from "~src/constants";

const TOKEN_AUTHORIZATION_TYPE = "Bearer";

const getTokenFromAuthorizationHeader = (header: string): string => {
  return header.replace(new RegExp(`^${TOKEN_AUTHORIZATION_TYPE}`), "").trim();
};

export default async (ctx: Context, next: Next): Promise<void> => {
  const userRepository = (ctx.container as Container).get<IUserRepository>(IDENTIFIERS.USER_REPOSITORY);

  const user = await userRepository.getByEmail(DEFAULT_USER_EMAIL, DEFAULT_COMPANY_ID);

  ctx.context = { ...ctx.context, token: "", user, company: user?.company };

  await next();

  /*if (!ctx.req.headers.authorization || ctx.req.headers.authorization.indexOf(TOKEN_AUTHORIZATION_TYPE) === -1) {
    return next();
  }

  const token = getTokenFromAuthorizationHeader(ctx.req.headers.authorization);

  if (!token) {
    return next();
  }

  const jwksClient = (ctx.container as Container).get<JwksClient>(IDENTIFIERS.JWKS_CLIENT);

  let user: IUserFull = null;
  let company: ICompany = null;

  try {
    const decodedToken = jwt.decode(token, {
      complete: true,
    });

    const jwksPayload = await jwksClient.getSigningKey(decodedToken.header.kid);

    const payload = (await jwt.verify(token, jwksPayload.getPublicKey(), {
      audience: SSO_AUDIENCE,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as { [key: string]: any };

    const externalId = payload?.ext?.user_long_id.toString();
    const companyId = payload?.ext?.company_id;

    const idpClient = (ctx.container as Container).get<IIDPClient>(IDENTIFIERS.IDP_CLIENT);
    const companyRepository = (ctx.container as Container).get<ICompanyRepository>(IDENTIFIERS.COMPANY_REPOSITORY);
    const userRepository = (ctx.container as Container).get<IUserRepository>(IDENTIFIERS.USER_REPOSITORY);

    try {
      user = await userRepository.getByExternalId(externalId, companyId);
    } catch (e) {
      // NOP just ignore the error
    }

    if (!user) {
      try {
        company = await companyRepository.get(companyId);
      } catch (e) {
        // NOP just ignore the error
      }

      if (!company) {
        const externalCompany = await idpClient.companyInfo(companyId);

        company = await companyRepository.create({ id: companyId, name: externalCompany.company.companyName });
      }

      const externalUser = await idpClient.me(token);

      user = await userRepository.create({
        externalId,
        email: externalUser.email,
        locale: externalUser.locale,
        timeZone: DEFAULT_TIMEZONE,
        firstName: externalUser.firstname,
        lastName: externalUser.lastname,
        avatarImageUrl: externalUser.avatarImageUrl,
        company,
      });
    }
  } catch (e) {
    console.error(new Date(), "Token validation error: ", e);
    // NOP just ignore invalid authorization header
  }

  ctx.context = { ...ctx.context, token, user, company: user?.company };

  await next();*/
};
