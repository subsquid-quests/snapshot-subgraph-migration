"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setup_1 = require("./setup");
describe('typed json fields', function () {
    (0, setup_1.useDatabase)([
        `create table entity (id text primary key, a jsonb)`,
        `insert into entity (id, a) values ('1', '{"a": "a", "b": {"b": "b", "e": "1"}, "c": [1, 2, 3]}'::jsonb)`,
        `insert into entity (id, a) values ('2', '{"a": "A", "b": {"b": "B", "e": "1"}}'::jsonb)`,
        `insert into entity (id, a) values ('3', '{}'::jsonb)`,
        `insert into entity (id) values ('4')`,
    ]);
    const client = (0, setup_1.useServer)(`
        type Entity @entity {
            a: A
        }
        
        type A {
            a: String
            b: B
            c: JSON
        }
        
        type B {
            a: A
            b: String
            e: Entity
        }
    `);
    it('maps nulls correctly', function () {
        return client.test(`
            query {
                entities(orderBy: id_ASC) { 
                    id 
                    a { a } 
                }
            }
        `, {
            entities: [
                { id: '1', a: { a: 'a' } },
                { id: '2', a: { a: 'A' } },
                { id: '3', a: { a: null } },
                { id: '4', a: null }
            ]
        });
    });
    it('nested JSON scalar', function () {
        return client.test(`
            query {
                entities(where: {id_eq: "1"}) {
                    a { c }
                }
            }
        `, {
            entities: [{
                    a: { c: [1, 2, 3] }
                }]
        });
    });
    it('can fetch deep entities', function () {
        return client.test(`
            query {
                entities(orderBy: id_ASC) { 
                    id 
                    a { 
                        b {
                            e {
                                id
                                a {
                                    b {
                                        b
                                        e { id }
                                    }
                                }
                            }
                        }
                    } 
                }
            }
        `, {
            entities: [
                { id: '1', a: { b: { e: { id: '1', a: { b: { b: 'b', e: { id: '1' } } } } } } },
                { id: '2', a: { b: { e: { id: '1', a: { b: { b: 'b', e: { id: '1' } } } } } } },
                { id: '3', a: { b: null } },
                { id: '4', a: null }
            ]
        });
    });
});
//# sourceMappingURL=typed-json.test.js.map