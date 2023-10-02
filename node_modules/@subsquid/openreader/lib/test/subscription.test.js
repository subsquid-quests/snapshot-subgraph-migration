"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_internal_1 = require("@subsquid/util-internal");
const expect_1 = __importDefault(require("expect"));
const setup_1 = require("./setup");
describe("subscriptions", function () {
    (0, setup_1.useDatabase)([
        `create table "order" (id text primary key, kind text not null, name text)`,
        `create table item (id text primary key, order_id text, name text)`,
    ]);
    const client = (0, setup_1.useServer)(`
        type Order @entity {
            id: ID!
            kind: String!
            name: String
            items: [Item!]! @derivedFrom(field: "order")
        }
        
        type Item @entity {
            id: ID!
            order: Order
            name: String
        }
    `);
    it("entity list", function () {
        return client.subscriptionTest(`
            subscription {
                orders(where: {kind_eq: "list"}, orderBy: id_ASC) {
                    id
                    name
                    items(orderBy: id_ASC) {
                        name
                    }
                }
            }
        `, async (take) => {
            await (0, util_internal_1.wait)(100);
            (0, expect_1.default)(await take()).toEqual({ data: { orders: [] } });
            await (0, setup_1.databaseExecute)([
                `insert into "order" (id, kind) values ('1', 'list')`,
                `insert into "order" (id, kind) values ('2', 'foo')`,
            ]);
            (0, expect_1.default)(await take()).toEqual({
                data: {
                    orders: [{ id: '1', name: null, items: [] }]
                }
            });
            await (0, setup_1.databaseExecute)([`
                update "order" set name = 'hello' where id in ('1', '2');
                insert into item (id, "order_id", name) values ('1-1', '1', '123')
            `]);
            (0, expect_1.default)(await take()).toEqual({
                data: {
                    orders: [
                        { id: '1', name: 'hello', items: [{ name: '123' }] }
                    ]
                }
            });
        });
    });
    it("entity by id", async function () {
        await (0, setup_1.databaseExecute)([
            `insert into "order" (id, kind) values ('3', 'by id')`,
            `insert into item (id, "order_id", name) values ('3-1', '3', 'hello')`
        ]);
        await client.subscriptionTest(`
            subscription {
                third: orderById(id: "3") {
                    name
                    items(orderBy: id_ASC) {
                        name
                    }
                }
            }
        `, async (take) => {
            await (0, util_internal_1.wait)(100);
            (0, expect_1.default)(await take()).toEqual({
                data: {
                    third: {
                        name: null,
                        items: [
                            { name: 'hello' }
                        ]
                    }
                }
            });
            await (0, setup_1.databaseExecute)([`
                start transaction;
                update "order" set name = 'foo' where id = '3';
                insert into item (id, "order_id", name) values ('3-2', '3', 'world');
                commit;
            `]);
            (0, expect_1.default)(await take()).toEqual({
                data: {
                    third: {
                        name: 'foo',
                        items: [
                            { name: 'hello' },
                            { name: 'world' }
                        ]
                    }
                }
            });
        });
    });
});
//# sourceMappingURL=subscription.test.js.map