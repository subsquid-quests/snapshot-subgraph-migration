module.exports = class Data1696179919371 {
    name = 'Data1696179919371'

    async up(db) {
        await db.query(`ALTER TABLE "delegation" DROP COLUMN "timestamp"`)
        await db.query(`ALTER TABLE "delegation" ADD "timestamp" numeric NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "delegation" ADD "timestamp" integer NOT NULL`)
        await db.query(`ALTER TABLE "delegation" DROP COLUMN "timestamp"`)
    }
}
