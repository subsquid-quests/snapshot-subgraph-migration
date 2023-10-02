"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customScalars = void 0;
const BigInt_1 = require("./BigInt");
const BigDecimal_1 = require("./BigDecimal");
const Bytes_1 = require("./Bytes");
const DateTime_1 = require("./DateTime");
const JSON_1 = require("./JSON");
exports.customScalars = {
    BigInt: BigInt_1.BigIntScalar,
    BigDecimal: BigDecimal_1.BigDecimalScalar,
    Bytes: Bytes_1.BytesScalar,
    DateTime: DateTime_1.DateTimeScalar,
    JSON: JSON_1.JSONScalar,
};
//# sourceMappingURL=index.js.map