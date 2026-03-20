/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddMissingColumnsToUsers1773972780316 {
    name = 'AddMissingColumnsToUsers1773972780316'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "fullName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatarUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "githubUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "linkedinUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "software" ADD "authorId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "software" ADD CONSTRAINT "FK_697d896d68e3bb29d819b437e35" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "software" DROP CONSTRAINT "FK_697d896d68e3bb29d819b437e35"`);
        await queryRunner.query(`ALTER TABLE "software" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "linkedinUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "githubUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
    }
}
