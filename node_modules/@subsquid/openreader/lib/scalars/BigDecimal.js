"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigDecimalScalar = void 0;
const graphql_1 = require("graphql");
const big_decimal_1 = require("../util/big-decimal");
const util_1 = require("../util/util");
exports.BigDecimalScalar = new graphql_1.GraphQLScalarType({
    name: 'BigDecimal',
    description: 'Big number decimal',
    serialize(value) {
        return big_decimal_1.bigDecimal.BigDecimal(value).toString();
    },
    parseValue(value) {
        if (!isDecimal(value))
            throw (0, util_1.invalidFormat)('BigDecimal', value);
        return big_decimal_1.bigDecimal.BigDecimal(value);
    },
    parseLiteral(ast) {
        switch (ast.kind) {
            case "StringValue":
                if (isDecimal(ast.value)) {
                    return big_decimal_1.bigDecimal.BigDecimal(ast.value);
                }
                else {
                    throw (0, util_1.invalidFormat)('BigDecimal', ast.value);
                }
            case "IntValue":
            case "FloatValue":
                return big_decimal_1.bigDecimal.BigDecimal(ast.value);
            default:
                return null;
        }
    }
});
function isDecimal(s) {
    return /^[+\-]?\d+\.?(\d+)?(e[+\-]?\d+)?$/.test(s);
}
//# sourceMappingURL=BigDecimal.js.map