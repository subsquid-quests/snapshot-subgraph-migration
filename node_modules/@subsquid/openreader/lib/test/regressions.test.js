"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setup_1 = require("./setup");
describe('regressions', function () {
    describe('empty lookup lists', function () {
        (0, setup_1.useDatabase)([
            `create table "order" (id text primary key)`,
            `create table item (id text primary key, order_id text)`,
            `insert into "order" (id) values ('1')`
        ]);
        const client = (0, setup_1.useServer)(`
            type Order @entity {
                id: ID!
                items: [Item!]! @derivedFrom(field: "order")
            }
            
            type Item @entity {
                id: ID!
                order: Order
            }
        `);
        it('should return empty array for empty lookup list', async function () {
            return client.test(`
                query {
                    orders {
                        id
                        items { id }
                    }
                }
            `, {
                orders: [{
                        id: '1',
                        items: []
                    }]
            });
        });
    });
});
//# sourceMappingURL=regressions.test.js.map