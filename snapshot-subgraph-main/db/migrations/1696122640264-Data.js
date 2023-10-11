module.exports = class Data1696122640264 {
    name = 'Data1696122640264'

    async up(db) {
        await db.query(`CREATE TABLE "delegation" ("id" character varying NOT NULL, "delegator" text NOT NULL, "space" text NOT NULL, "delegate" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_a2cb6c9b942d68b109131beab44" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "block" ("id" character varying NOT NULL, "number" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "sig" ("id" character varying NOT NULL, "account" text NOT NULL, "msg_hash" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_cea4b8c97c20154f9d4229eef13" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "delegation"`)
        await db.query(`DROP TABLE "block"`)
        await db.query(`DROP TABLE "sig"`)
    }
}
