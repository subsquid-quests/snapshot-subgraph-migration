"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_FIELDS = void 0;
exports.DEFAULT_FIELDS = {
    block: {
        timestamp: true
    },
    log: {
        address: true,
        topics: true,
        data: true
    },
    transaction: {
        from: true,
        to: true,
        hash: true
    },
    trace: {
        error: true
    },
    stateDiff: {
        kind: true,
        next: true,
        prev: true
    }
};
//# sourceMappingURL=data.js.map