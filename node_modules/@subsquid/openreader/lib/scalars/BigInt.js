"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntScalar = void 0;
const graphql_1 = require("graphql");
const util_1 = require("../util/util");
exports.BigIntScalar = new graphql_1.GraphQLScalarType({
    name: 'BigInt',
    description: 'Big number integer',
    serialize(value) {
        return '' + value;
    },
    parseValue(value) {
        if (!isBigInt(value))
            throw (0, util_1.invalidFormat)('BigInt', value);
        return BigInt(value);
    },
    parseLiteral(ast) {
        switch (ast.kind) {
            case "StringValue":
                if (isBigInt(ast.value)) {
                    return BigInt(ast.value);
                }
                else {
                    throw (0, util_1.invalidFormat)('BigInt', ast.value);
                }
            case "IntValue":
                return BigInt(ast.value);
            default:
                return null;
        }
    }
});
function isBigInt(s) {
    return /^[+\-]?\d+$/.test(s);
}
//# sourceMappingURL=BigInt.js.map