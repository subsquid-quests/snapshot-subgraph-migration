"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeScalar = void 0;
const graphql_1 = require("graphql");
const util_1 = require("../util/util");
exports.DateTimeScalar = new graphql_1.GraphQLScalarType({
    name: 'DateTime',
    description: 'A date-time string in simplified extended ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
    serialize(value) {
        if (value instanceof Date) {
            return value.toISOString();
        }
        else {
            if (!isIsoDateTimeString(value))
                throw (0, util_1.invalidFormat)('DateTime', value);
            return value;
        }
    },
    parseValue(value) {
        return parseDateTime(value);
    },
    parseLiteral(ast) {
        switch (ast.kind) {
            case "StringValue":
                return parseDateTime(ast.value);
            default:
                return null;
        }
    }
});
// credit - https://github.com/Urigo/graphql-scalars/blob/91b4ea8df891be8af7904cf84751930cc0c6613d/src/scalars/iso-date/validator.ts#L122
const RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60))(\.\d{1,})?([Z])$/;
function isIsoDateTimeString(s) {
    return RFC_3339_REGEX.test(s);
}
function parseDateTime(s) {
    if (!isIsoDateTimeString(s))
        throw (0, util_1.invalidFormat)('DateTime', s);
    let timestamp = Date.parse(s);
    if (isNaN(timestamp))
        throw (0, util_1.invalidFormat)('DateTime', s);
    return new Date(timestamp);
}
//# sourceMappingURL=DateTime.js.map