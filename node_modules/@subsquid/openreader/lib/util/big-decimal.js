"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigDecimal = void 0;
exports.bigDecimal = {
    get BigDecimal() {
        throw new Error('Package `@subsquid/big-decimal` is not installed');
    }
};
try {
    Object.defineProperty(exports.bigDecimal, "BigDecimal", {
        value: require('@subsquid/big-decimal').BigDecimal
    });
}
catch (e) { }
//# sourceMappingURL=big-decimal.js.map