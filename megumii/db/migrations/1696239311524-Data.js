module.exports = class Data1696239311524 {
    name = 'Data1696239311524'

    async up(db) {
        await db.query(`CREATE TABLE "delegation" ("id" character varying NOT NULL, "delegator" text NOT NULL, "space" text NOT NULL, "delegate" text NOT NULL, "timestamp" integer NOT NULL, CONSTRAINT "PK_a2cb6c9b942d68b109131beab44" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "block" ("id" character varying NOT NULL, "number" numeric NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "sig" ("id" character varying NOT NULL, "owner" text NOT NULL, "approved_hash" text NOT NULL, "handler" text NOT NULL, "guard" text NOT NULL, "threshold" numeric NOT NULL, "initiator" text NOT NULL, "payment" numeric NOT NULL, "sender" text NOT NULL, "owners" text array NOT NULL, "proxy" text NOT NULL, "value" numeric NOT NULL, "initializer" text NOT NULL, "fallback_handler" text NOT NULL, "tx_hash" text NOT NULL, "module" text NOT NULL, "account" bytea NOT NULL, "msg_hash" text NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_cea4b8c97c20154f9d4229eef13" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "delegation"`)
        await db.query(`DROP TABLE "block"`)
        await db.query(`DROP TABLE "sig"`)
    }
}
