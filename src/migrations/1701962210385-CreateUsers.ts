import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as generateId } from "uuid";
import { DEFAULT_COMPANY_ID, DEFAULT_TIMEZONE } from "~src/constants";

// TODO: this migration has to be removed in future
export class CreateUsers1701962210385 implements MigrationInterface {
  name = "CreateUsers1701962210385";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = [
      {
        department: "DEVELOPER",
        firstName: "Ruslan",
        lastName: "Naeltok",
        avatar:
          "https://localhost:8443/assets/public/media/get/009adb9ac9a14aab82926f1ffa65e638/1446630564682/hp-baxxter--doep-doep-doep-doedoedoepdoepdoep.jpg",
        access_token: "bEj3VqlNZhGjGy3M8lox_C5PFklOGzpG",
        token_type: "bearer",
        expires_in: 10800,
        refresh_token: "iBqW0DGHZ9Qu1DA8O9LT3GcfH_6MRcyJ",
        scope: "read_write create_event delete_event read_events",
        sub: "acc_6569a962a58ab3360247ace7",
        account_id: "acc_6569a962a58ab3360247ace7",
        linking_profile: {
          provider_name: "exchange",
          profile_id: "pro_ZWnSISC5gALqbUye",
          profile_name: "ruslan.naeltok@softgarden.de",
          provider_service: "office365",
        },
      },
      {
        department: "DEVELOPER",
        firstName: "Rafal",
        lastName: "Giemza",
        avatar: "",
        access_token: "A6Fdig7H_9DiKdZCQTxWZCkDs4gKTFCx",
        token_type: "bearer",
        expires_in: 10800,
        refresh_token: "BN4zkMw7ob50DTvj8Xh0lXLSG_iICbUa",
        scope: "create_event delete_event read_events",
        sub: "acc_656dfe07ab38070282cb4762",
        account_id: "acc_656dfe07ab38070282cb4762",
        linking_profile: {
          provider_name: "exchange",
          profile_id: "pro_ZW3-Bqs4BwKCy0db",
          profile_name: "rafal.giemza@softgarden.de",
          provider_service: "office365",
        },
      },
      {
        department: "HEAD",
        firstName: "Martin",
        lastName: "Szymanski",
        avatar: "",
        access_token: "JFpbE0v6Qu0nWMg3mTThqs8zTjO0TuSP",
        token_type: "bearer",
        expires_in: 10800,
        refresh_token: "_ZnX72ceb01Exuz-p3UOnhdk7UTlJ2SP",
        scope: "read_write",
        sub: "acc_5f311717bb96010061f8823b",
        account_id: "acc_5f311717bb96010061f8823b",
        linking_profile: {
          provider_name: "exchange",
          profile_id: "pro_XzEXFbuWAQBh-IIz",
          profile_name: "martin.szymanski@softgarden.de",
          provider_service: "office365",
        },
      },
      {
        department: "DESIGN",
        firstName: "Claudia",
        lastName: "Wensierska",
        avatar: "",
        access_token: "lu2UHj4_xOORjPgFLtDqNLfFJ1i2MS7S",
        token_type: "bearer",
        expires_in: 10800,
        refresh_token: "22tNPCrSr3uu6baOZLyf_goy_S5faBZi",
        scope: "read_write",
        sub: "acc_655f69b7bd2e7b01e0da91de",
        account_id: "acc_655f69b7bd2e7b01e0da91de",
        linking_profile: {
          provider_name: "exchange",
          profile_id: "pro_ZV9pt70uewHg2pHW",
          profile_name: "claudia.wensierska@softgarden.de",
          provider_service: "office365",
        },
      },
    ];

    await queryRunner.query(`delete from user`);
    await queryRunner.query(`delete from company`);

    await queryRunner.query(`insert into company (id, name) values(?, ?)`, [DEFAULT_COMPANY_ID, "Softgarden"]);

    for (const user of users) {
      const id = generateId();

      await queryRunner.query(
        `insert into user (id, externalId, email, department, locale, timeZone, firstName, lastName, avatarImageUrl, pauseMe, companyId) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          null,
          user.linking_profile.profile_name,
          user.department,
          "en",
          DEFAULT_TIMEZONE,
          user.firstName,
          user.lastName,
          user.avatar,
          false,
          DEFAULT_COMPANY_ID,
        ]
      );

      await queryRunner.query(
        `insert into cronofy (id, accessToken, refreshToken, scope, sub, userId) values(?, ?, ?, ?, ?, ?)`,
        [generateId(), user.access_token, user.refresh_token, user.scope, user.sub, id]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
