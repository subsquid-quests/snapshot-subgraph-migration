"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONScalar = void 0;
const graphql_1 = require("graphql");
exports.JSONScalar = new graphql_1.GraphQLScalarType({
    name: 'JSON',
    description: 'A scalar that can represent any JSON value',
});
//# sourceMappingURL=JSON.js.map