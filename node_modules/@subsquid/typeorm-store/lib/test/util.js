"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntityManager = exports.useDatabase = exports.databaseDelete = exports.databaseInit = exports.db_config = void 0;
const typeorm_config_1 = require("@subsquid/typeorm-config");
const util_internal_1 = require("@subsquid/util-internal");
const pg_1 = require("pg");
const typeorm_1 = require("typeorm");
exports.db_config = {
    host: 'localhost',
    port: parseInt((0, util_internal_1.assertNotNull)(process.env.DB_PORT)),
    user: (0, util_internal_1.assertNotNull)(process.env.DB_USER),
    password: (0, util_internal_1.assertNotNull)(process.env.DB_PASS),
    database: (0, util_internal_1.assertNotNull)(process.env.DB_NAME)
};
async function withClient(block) {
    let client = new pg_1.Client(exports.db_config);
    await client.connect();
    try {
        await block(client);
    }
    finally {
        await client.end();
    }
}
function databaseInit(sql) {
    return withClient(async (client) => {
        for (let i = 0; i < sql.length; i++) {
            await client.query(sql[i]);
        }
    });
}
exports.databaseInit = databaseInit;
function databaseDelete() {
    return withClient(async (client) => {
        await client.query(`DROP SCHEMA IF EXISTS ${exports.db_config.user} CASCADE`);
        await client.query(`DROP SCHEMA IF EXISTS squid_processor CASCADE`);
        await client.query(`CREATE SCHEMA ${exports.db_config.user}`);
    });
}
exports.databaseDelete = databaseDelete;
function useDatabase(sql) {
    beforeEach(async () => {
        await databaseDelete();
        await databaseInit(sql);
    });
}
exports.useDatabase = useDatabase;
let connection;
function getEntityManager() {
    if (connection == null) {
        let cfg = (0, typeorm_config_1.createOrmConfig)({ projectDir: __dirname });
        connection = new typeorm_1.DataSource(cfg).initialize();
    }
    return connection.then(con => con.createEntityManager());
}
exports.getEntityManager = getEntityManager;
//# sourceMappingURL=util.js.map