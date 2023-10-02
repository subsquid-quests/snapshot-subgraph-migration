"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemIds = exports.getItems = exports.createStore = void 0;
const util_internal_1 = require("@subsquid/util-internal");
const expect_1 = __importDefault(require("expect"));
const typeorm_1 = require("typeorm");
const store_1 = require("../store");
const model_1 = require("./lib/model");
const util_1 = require("./util");
describe("Store", function () {
    describe(".save()", function () {
        (0, util_1.useDatabase)([
            `CREATE TABLE item (id text primary key , name text)`
        ]);
        it("saving of a single entity", async function () {
            let store = await createStore();
            await store.save(new model_1.Item('1', 'a'));
            await (0, expect_1.default)(getItems()).resolves.toEqual([{ id: '1', name: 'a' }]);
        });
        it("saving of multiple entities", async function () {
            let store = await createStore();
            await store.save([new model_1.Item('1', 'a'), new model_1.Item('2', 'b')]);
            await (0, expect_1.default)(getItems()).resolves.toEqual([
                { id: '1', name: 'a' },
                { id: '2', name: 'b' }
            ]);
        });
        it("saving a large amount of entities", async function () {
            let store = await createStore();
            let items = [];
            for (let i = 0; i < 20000; i++) {
                items.push(new model_1.Item('' + i));
            }
            await store.save(items);
            (0, expect_1.default)(await store.count(model_1.Item)).toEqual(items.length);
        });
        it("updates", async function () {
            let store = await createStore();
            await store.save(new model_1.Item('1', 'a'));
            await store.save([
                new model_1.Item('1', 'foo'),
                new model_1.Item('2', 'b')
            ]);
            await (0, expect_1.default)(getItems()).resolves.toEqual([
                { id: '1', name: 'foo' },
                { id: '2', name: 'b' }
            ]);
        });
    });
    describe(".remove()", function () {
        (0, util_1.useDatabase)([
            `CREATE TABLE item (id text primary key , name text)`,
            `INSERT INTO item (id, name) values ('1', 'a')`,
            `INSERT INTO item (id, name) values ('2', 'b')`,
            `INSERT INTO item (id, name) values ('3', 'c')`
        ]);
        it("removal by passing an entity", async function () {
            let store = await createStore();
            await store.remove(new model_1.Item('1'));
            await (0, expect_1.default)(getItemIds()).resolves.toEqual(['2', '3']);
        });
        it("removal by passing an array of entities", async function () {
            let store = await createStore();
            await store.remove([
                new model_1.Item('1'),
                new model_1.Item('3')
            ]);
            await (0, expect_1.default)(getItemIds()).resolves.toEqual(['2']);
        });
        it("removal by passing an id", async function () {
            let store = await createStore();
            await store.remove(model_1.Item, '1');
            await (0, expect_1.default)(getItemIds()).resolves.toEqual(['2', '3']);
        });
        it("removal by passing an array of ids", async function () {
            let store = await createStore();
            await store.remove(model_1.Item, ['1', '2']);
            await (0, expect_1.default)(getItemIds()).resolves.toEqual(['3']);
        });
    });
    describe("Update with un-fetched reference", function () {
        (0, util_1.useDatabase)([
            `CREATE TABLE item (id text primary key , name text)`,
            `CREATE TABLE "order" (id text primary key, item_id text REFERENCES item, qty int4)`,
            `INSERT INTO item (id, name) values ('1', 'a')`,
            `INSERT INTO "order" (id, item_id, qty) values ('1', '1', 3)`,
            `INSERT INTO item (id, name) values ('2', 'b')`,
            `INSERT INTO "order" (id, item_id, qty) values ('2', '2', 3)`
        ]);
        it(".save() doesn't clear reference (single row update)", async function () {
            let store = await createStore();
            let order = (0, util_internal_1.assertNotNull)(await store.get(model_1.Order, '1'));
            order.qty = 5;
            await store.save(order);
            let newOrder = await store.findOneOrFail(model_1.Order, {
                where: { id: (0, typeorm_1.Equal)('1') },
                relations: {
                    item: true
                }
            });
            (0, expect_1.default)(newOrder.qty).toEqual(5);
            (0, expect_1.default)(newOrder.item.id).toEqual('1');
        });
        it(".save() doesn't clear reference (multi row update)", async function () {
            let store = await createStore();
            let orders = await store.find(model_1.Order, { order: { id: 'ASC' } });
            let items = await store.find(model_1.Item, { order: { id: 'ASC' } });
            orders[0].qty = 5;
            orders[1].qty = 1;
            orders[1].item = items[0];
            await store.save(orders);
            let newOrders = await store.find(model_1.Order, {
                relations: {
                    item: true
                },
                order: { id: 'ASC' }
            });
            (0, expect_1.default)(newOrders).toEqual([
                {
                    id: '1',
                    item: {
                        id: '1',
                        name: 'a'
                    },
                    qty: 5
                },
                {
                    id: '2',
                    item: {
                        id: '1',
                        name: 'a'
                    },
                    qty: 1
                }
            ]);
        });
    });
});
function createStore() {
    return (0, util_1.getEntityManager)().then(em => new store_1.Store(() => em));
}
exports.createStore = createStore;
async function getItems() {
    let em = await (0, util_1.getEntityManager)();
    return em.find(model_1.Item);
}
exports.getItems = getItems;
function getItemIds() {
    return getItems().then(items => items.map(it => it.id).sort());
}
exports.getItemIds = getItemIds;
//# sourceMappingURL=store.test.js.map