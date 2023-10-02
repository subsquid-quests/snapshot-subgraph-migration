"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BytesScalar = void 0;
const util_internal_hex_1 = require("@subsquid/util-internal-hex");
const graphql_1 = require("graphql");
const util_1 = require("../util/util");
exports.BytesScalar = new graphql_1.GraphQLScalarType({
    name: 'Bytes',
    description: 'Binary data encoded as a hex string always prefixed with 0x',
    serialize(value) {
        if (typeof value == 'string') {
            if (!(0, util_internal_hex_1.isHex)(value))
                throw (0, util_1.invalidFormat)('Bytes', value);
            return value.toLowerCase();
        }
        else {
            return (0, util_internal_hex_1.toHex)(value);
        }
    },
    parseValue(value) {
        return (0, util_internal_hex_1.decodeHex)(value);
    },
    parseLiteral(ast) {
        switch (ast.kind) {
            case "StringValue":
                return (0, util_internal_hex_1.decodeHex)(ast.value);
            default:
                return null;
        }
    }
});
//# sourceMappingURL=Bytes.js.map