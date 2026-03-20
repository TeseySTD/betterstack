import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialFullSchema1773958702614 implements MigrationInterface {
    name = 'InitialFullSchema1773958702614';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "fullName" character varying, "bio" text, "avatarUrl" character varying, "githubUrl" character varying, "linkedinUrl" character varying, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "software_usages" ("user_id" integer NOT NULL, "software_id" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_4746fda7da369777f4f530bf0dd" PRIMARY KEY ("user_id", "software_id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "software_factors" ("software_id" integer NOT NULL, "factor_id" integer NOT NULL, "factorName" character varying(50) NOT NULL, "isPositive" boolean NOT NULL, CONSTRAINT "PK_3032bdacd4abfdab4daf990ad6e" PRIMARY KEY ("software_id", "factor_id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "software_metrics" ("software_id" integer NOT NULL, "metric_id" integer NOT NULL, "value" numeric NOT NULL, "metricName" character varying(50) NOT NULL, CONSTRAINT "PK_a27a87b08c2febf72165521786e" PRIMARY KEY ("software_id", "metric_id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "software_comparison_notes" ("software_a_id" integer NOT NULL, "software_b_id" integer NOT NULL, "note" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a14a61dcf66b31e1cd84457188e" PRIMARY KEY ("software_a_id", "software_b_id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "software" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "name" character varying(50) NOT NULL, "developer" character varying(50) NOT NULL, "shortDescription" character varying(255) NOT NULL, "fullDescription" text, "websiteUrl" character varying, "gitRepoUrl" character varying, "logoUrl" character varying, "screenshotUrls" text array NOT NULL DEFAULT '{}', "usageCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "authorId" integer NOT NULL, CONSTRAINT "UQ_5aa4fd3338b400cad5107ec318b" UNIQUE ("slug"), CONSTRAINT "UQ_b927db56077c0eaf4206ce48e6a" UNIQUE ("name"), CONSTRAINT "PK_3ceec82cc90b32643b07e8d9841" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "factors" ("id" SERIAL NOT NULL, "positiveVariant" character varying(50) NOT NULL, "negativeVariant" character varying(50) NOT NULL, CONSTRAINT "UQ_1345b61de2e5fac46c587d9c9e6" UNIQUE ("positiveVariant"), CONSTRAINT "UQ_1089ce2377c625a57aecf001087" UNIQUE ("negativeVariant"), CONSTRAINT "PK_20d131617d737679a49a36bef92" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "metrics" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "higherIsBetter" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_90eb9cf1a981244bb2c4870c9ce" UNIQUE ("name"), CONSTRAINT "PK_5283cad666a83376e28a715bf0e" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "software_categories" ("software_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_eb75aec7315a098802805841c47" PRIMARY KEY ("software_id", "category_id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_56798da2b378c2026b6618a42f" ON "software_categories" ("software_id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_38b3cb3fdc9be60080eec6f970" ON "software_categories" ("category_id") `,
        );
        await queryRunner.query(
            `CREATE TABLE "category_factors" ("category_id" integer NOT NULL, "factor_id" integer NOT NULL, CONSTRAINT "PK_9d2180bfcde605f9ff57e07d56b" PRIMARY KEY ("category_id", "factor_id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_693705dc05866f840699146824" ON "category_factors" ("category_id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_92afd18b570b52baed854359b8" ON "category_factors" ("factor_id") `,
        );
        await queryRunner.query(
            `CREATE TABLE "category_metrics" ("category_id" integer NOT NULL, "metric_id" integer NOT NULL, CONSTRAINT "PK_150e0284d1ae6ce633b35d5730e" PRIMARY KEY ("category_id", "metric_id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_a8a69509029bd07e21d5586a9d" ON "category_metrics" ("category_id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_ab5d76ac9ea21e195dfcd3665c" ON "category_metrics" ("metric_id") `,
        );
        await queryRunner.query(
            `ALTER TABLE "software_usages" ADD CONSTRAINT "FK_515de7747be1a8d976fdc24bc80" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_usages" ADD CONSTRAINT "FK_68273d2a1de54a2ab49dfab1d14" FOREIGN KEY ("software_id") REFERENCES "software"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_factors" ADD CONSTRAINT "FK_d0f695adcab92795dff697df689" FOREIGN KEY ("software_id") REFERENCES "software"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_factors" ADD CONSTRAINT "FK_3d3ca7f4d575cf013594e27c4d0" FOREIGN KEY ("factor_id") REFERENCES "factors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_metrics" ADD CONSTRAINT "FK_88d0e146cb346e206d1e770a364" FOREIGN KEY ("software_id") REFERENCES "software"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_metrics" ADD CONSTRAINT "FK_8eb1342521c82e484f483a16d69" FOREIGN KEY ("metric_id") REFERENCES "metrics"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_comparison_notes" ADD CONSTRAINT "FK_a3f5827500eb8a99d6dd0eac04f" FOREIGN KEY ("software_a_id") REFERENCES "software"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_comparison_notes" ADD CONSTRAINT "FK_8adc925e927763ca749cfd9e025" FOREIGN KEY ("software_b_id") REFERENCES "software"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "software" ADD CONSTRAINT "FK_697d896d68e3bb29d819b437e35" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_categories" ADD CONSTRAINT "FK_56798da2b378c2026b6618a42fc" FOREIGN KEY ("software_id") REFERENCES "software"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_categories" ADD CONSTRAINT "FK_38b3cb3fdc9be60080eec6f970b" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "category_factors" ADD CONSTRAINT "FK_693705dc05866f8406991468249" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "category_factors" ADD CONSTRAINT "FK_92afd18b570b52baed854359b88" FOREIGN KEY ("factor_id") REFERENCES "factors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "category_metrics" ADD CONSTRAINT "FK_a8a69509029bd07e21d5586a9d8" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "category_metrics" ADD CONSTRAINT "FK_ab5d76ac9ea21e195dfcd3665c9" FOREIGN KEY ("metric_id") REFERENCES "metrics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "category_metrics" DROP CONSTRAINT "FK_ab5d76ac9ea21e195dfcd3665c9"`,
        );
        await queryRunner.query(
            `ALTER TABLE "category_metrics" DROP CONSTRAINT "FK_a8a69509029bd07e21d5586a9d8"`,
        );
        await queryRunner.query(
            `ALTER TABLE "category_factors" DROP CONSTRAINT "FK_92afd18b570b52baed854359b88"`,
        );
        await queryRunner.query(
            `ALTER TABLE "category_factors" DROP CONSTRAINT "FK_693705dc05866f8406991468249"`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_categories" DROP CONSTRAINT "FK_38b3cb3fdc9be60080eec6f970b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_categories" DROP CONSTRAINT "FK_56798da2b378c2026b6618a42fc"`,
        );
        await queryRunner.query(
            `ALTER TABLE "software" DROP CONSTRAINT "FK_697d896d68e3bb29d819b437e35"`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_comparison_notes" DROP CONSTRAINT "FK_8adc925e927763ca749cfd9e025"`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_comparison_notes" DROP CONSTRAINT "FK_a3f5827500eb8a99d6dd0eac04f"`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_metrics" DROP CONSTRAINT "FK_8eb1342521c82e484f483a16d69"`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_metrics" DROP CONSTRAINT "FK_88d0e146cb346e206d1e770a364"`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_factors" DROP CONSTRAINT "FK_3d3ca7f4d575cf013594e27c4d0"`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_factors" DROP CONSTRAINT "FK_d0f695adcab92795dff697df689"`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_usages" DROP CONSTRAINT "FK_68273d2a1de54a2ab49dfab1d14"`,
        );
        await queryRunner.query(
            `ALTER TABLE "software_usages" DROP CONSTRAINT "FK_515de7747be1a8d976fdc24bc80"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_ab5d76ac9ea21e195dfcd3665c"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_a8a69509029bd07e21d5586a9d"`,
        );
        await queryRunner.query(`DROP TABLE "category_metrics"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_92afd18b570b52baed854359b8"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_693705dc05866f840699146824"`,
        );
        await queryRunner.query(`DROP TABLE "category_factors"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_38b3cb3fdc9be60080eec6f970"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_56798da2b378c2026b6618a42f"`,
        );
        await queryRunner.query(`DROP TABLE "software_categories"`);
        await queryRunner.query(`DROP TABLE "metrics"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "factors"`);
        await queryRunner.query(`DROP TABLE "software"`);
        await queryRunner.query(`DROP TABLE "software_comparison_notes"`);
        await queryRunner.query(`DROP TABLE "software_metrics"`);
        await queryRunner.query(`DROP TABLE "software_factors"`);
        await queryRunner.query(`DROP TABLE "software_usages"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
