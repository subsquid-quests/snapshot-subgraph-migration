"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnakeNamingStrategy = void 0;
const util_naming_1 = require("@subsquid/util-naming");
const typeorm_1 = require("typeorm");
class SnakeNamingStrategy extends typeorm_1.DefaultNamingStrategy {
    tableName(className, customName) {
        return customName || (0, util_naming_1.toSnakeCase)(className);
    }
    columnName(propertyName, customName, embeddedPrefixes = []) {
        return ((0, util_naming_1.toSnakeCase)(embeddedPrefixes.join('_')) +
            (customName || (0, util_naming_1.toSnakeCase)(propertyName)));
    }
    relationName(propertyName) {
        return (0, util_naming_1.toSnakeCase)(propertyName);
    }
    joinColumnName(relationName, referencedColumnName) {
        return (0, util_naming_1.toSnakeCase)(`${relationName}_${referencedColumnName}`);
    }
    joinTableName(firstTableName, secondTableName) {
        return (0, util_naming_1.toSnakeCase)(`${firstTableName}_${secondTableName}`);
    }
    joinTableColumnName(tableName, propertyName, columnName) {
        return `${(0, util_naming_1.toSnakeCase)(tableName)}_${columnName || (0, util_naming_1.toSnakeCase)(propertyName)}`;
    }
}
exports.SnakeNamingStrategy = SnakeNamingStrategy;
//# sourceMappingURL=namingStrategy.js.map