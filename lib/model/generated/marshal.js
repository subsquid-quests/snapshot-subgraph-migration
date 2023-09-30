"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumFromJson = exports.bigdecimalTransformer = exports.floatTransformer = exports.bigintTransformer = exports.nonNull = exports.fromList = exports.bytes = exports.datetime = exports.bigdecimal = exports.bigint = exports.boolean = exports.float = exports.int = exports.id = exports.string = void 0;
const assert_1 = __importDefault(require("assert"));
exports.string = {
    fromJSON(value) {
        (0, assert_1.default)(typeof value === 'string', 'invalid String');
        return value;
    },
    toJSON(value) {
        return value;
    }
};
exports.id = exports.string;
exports.int = {
    fromJSON(value) {
        (0, assert_1.default)(Number.isInteger(value), 'invalid Int');
        return value;
    },
    toJSON(value) {
        return value;
    }
};
exports.float = {
    fromJSON(value) {
        (0, assert_1.default)(typeof value === 'number', 'invalid Float');
        return value;
    },
    toJSON(value) {
        return value;
    }
};
exports.boolean = {
    fromJSON(value) {
        (0, assert_1.default)(typeof value === 'boolean', 'invalid Boolean');
        return value;
    },
    toJSON(value) {
        return value;
    }
};
exports.bigint = {
    fromJSON(value) {
        (0, assert_1.default)(typeof value === 'string', 'invalid BigInt');
        return BigInt(value);
    },
    toJSON(value) {
        return value.toString();
    }
};
exports.bigdecimal = {
    fromJSON(value) {
        (0, assert_1.default)(typeof value === 'string', 'invalid BigDecimal');
        return decimal.BigDecimal(value);
    },
    toJSON(value) {
        return value.toString();
    }
};
// credit - https://github.com/Urigo/graphql-scalars/blob/91b4ea8df891be8af7904cf84751930cc0c6613d/src/scalars/iso-date/validator.ts#L122
const RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60))(\.\d{1,})?([Z])$/;
function isIsoDateTimeString(s) {
    return RFC_3339_REGEX.test(s);
}
exports.datetime = {
    fromJSON(value) {
        (0, assert_1.default)(typeof value === 'string', 'invalid DateTime');
        (0, assert_1.default)(isIsoDateTimeString(value), 'invalid DateTime');
        return new Date(value);
    },
    toJSON(value) {
        return value.toISOString();
    }
};
exports.bytes = {
    fromJSON(value) {
        (0, assert_1.default)(typeof value === 'string', 'invalid Bytes');
        (0, assert_1.default)(value.length % 2 === 0, 'invalid Bytes');
        (0, assert_1.default)(/^0x[0-9a-f]+$/i.test(value), 'invalid Bytes');
        return Buffer.from(value.slice(2), 'hex');
    },
    toJSON(value) {
        if (Buffer.isBuffer(value)) {
            return '0x' + value.toString('hex');
        }
        else {
            return '0x' + Buffer.from(value.buffer, value.byteOffset, value.byteLength).toString('hex');
        }
    }
};
function fromList(list, f) {
    (0, assert_1.default)(Array.isArray(list));
    return list.map((val) => f(val));
}
exports.fromList = fromList;
function nonNull(val) {
    (0, assert_1.default)(val != null, 'non-nullable value is null');
    return val;
}
exports.nonNull = nonNull;
exports.bigintTransformer = {
    to(x) {
        return x?.toString();
    },
    from(s) {
        return s == null ? undefined : BigInt(s);
    }
};
exports.floatTransformer = {
    to(x) {
        return x?.toString();
    },
    from(s) {
        return s == null ? undefined : Number(s);
    }
};
exports.bigdecimalTransformer = {
    to(x) {
        return x?.toString();
    },
    from(s) {
        return s == null ? undefined : decimal.BigDecimal(s);
    }
};
function enumFromJson(json, enumObject) {
    (0, assert_1.default)(typeof json == 'string', 'invalid enum value');
    let val = enumObject[json];
    (0, assert_1.default)(typeof val == 'string', `invalid enum value`);
    return val;
}
exports.enumFromJson = enumFromJson;
const decimal = {
    get BigDecimal() {
        throw new Error('Package `@subsquid/big-decimal` is not installed');
    }
};
try {
    Object.defineProperty(decimal, "BigDecimal", {
        value: require('@subsquid/big-decimal').BigDecimal
    });
}
catch (e) { }
//# sourceMappingURL=marshal.js.map