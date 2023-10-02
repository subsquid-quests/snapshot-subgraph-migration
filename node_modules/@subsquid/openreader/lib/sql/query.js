"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionQuery = exports.CountQuery = exports.EntityByIdQuery = exports.ListQuery = void 0;
const util_internal_1 = require("@subsquid/util-internal");
const assert_1 = __importDefault(require("assert"));
const connection_1 = require("../ir/connection");
const util_1 = require("../util/util");
const mapping_1 = require("./mapping");
const printer_1 = require("./printer");
class ListQuery {
    constructor(model, dialect, typeName, fields, args) {
        this.fields = fields;
        this.params = [];
        if (model[typeName].kind == 'entity') {
            (0, assert_1.default)(Array.isArray(fields));
            this.sql = new printer_1.EntitySqlPrinter(model, dialect, typeName, this.params, args, fields).print();
        }
        else {
            (0, assert_1.default)(!Array.isArray(fields));
            this.sql = new printer_1.QueryableSqlPrinter(model, dialect, typeName, this.params, args, fields).print();
        }
    }
    map(rows) {
        if (Array.isArray(this.fields)) {
            return (0, mapping_1.mapRows)(rows, this.fields);
        }
        else {
            return (0, mapping_1.mapQueryableRows)(rows, this.fields);
        }
    }
}
exports.ListQuery = ListQuery;
class EntityByIdQuery {
    constructor(model, dialect, entityName, fields, id) {
        this.fields = fields;
        this.params = [];
        this.sql = new printer_1.EntitySqlPrinter(model, dialect, entityName, this.params, { where: { op: 'eq', field: 'id', value: id } }, fields).print();
    }
    map(rows) {
        (0, assert_1.default)(rows.length < 2);
        return (0, mapping_1.mapRows)(rows, this.fields)[0];
    }
}
exports.EntityByIdQuery = EntityByIdQuery;
class CountQuery {
    constructor(model, dialect, typeName, where) {
        this.params = [];
        let Printer = model[typeName].kind == 'entity' ? printer_1.EntitySqlPrinter : printer_1.QueryableSqlPrinter;
        this.sql = new Printer(model, dialect, typeName, this.params, { where }).printAsCount();
    }
    map(rows) {
        return toCount(rows);
    }
}
exports.CountQuery = CountQuery;
class ConnectionQuery {
    constructor(model, dialect, typeName, req) {
        this.params = [];
        this.offset = 0;
        this.limit = 100;
        this.setOffsetAndLimit(req);
        this.edgeCursor = req.edgeCursor;
        this.pageInfo = req.pageInfo;
        this.totalCount = req.totalCount;
        let args = {
            orderBy: req.orderBy,
            where: req.where,
            offset: this.offset,
            limit: this.limit + 1
        };
        let printer;
        if (model[typeName].kind == 'entity') {
            (0, assert_1.default)(req.edgeNode == null || Array.isArray(req.edgeNode));
            printer = new printer_1.EntitySqlPrinter(model, dialect, typeName, this.params, args, req.edgeNode);
        }
        else {
            (0, assert_1.default)(req.edgeNode == null || !Array.isArray(req.edgeNode));
            printer = new printer_1.QueryableSqlPrinter(model, dialect, typeName, this.params, args, req.edgeNode);
        }
        if (req.edgeNode) {
            this.edgeNode = req.edgeNode;
            this.sql = printer.print();
        }
        else {
            this.sql = printer.printAsCount();
        }
    }
    setOffsetAndLimit(req) {
        if (req.after != null) {
            this.offset = (0, util_internal_1.assertNotNull)((0, connection_1.decodeRelayConnectionCursor)(req.after));
        }
        if (req.first != null) {
            (0, assert_1.default)(req.first >= 0);
            this.limit = req.first;
        }
    }
    map(rows) {
        let res = {};
        if (this.edgeNode) {
            let nodes = Array.isArray(this.edgeNode) ? (0, mapping_1.mapRows)(rows, this.edgeNode) : (0, mapping_1.mapQueryableRows)(rows, this.edgeNode);
            let edges = new Array(Math.min(this.limit, nodes.length));
            for (let i = 0; i < edges.length; i++) {
                edges[i] = {
                    node: nodes[i],
                    cursor: this.edgeCursor ? (0, connection_1.encodeRelayConnectionCursor)(this.offset + i + 1) : undefined
                };
            }
            res.edges = edges;
            res.pageInfo = this.getPageInfo(nodes.length);
            res.totalCount = this.getTotalCount(nodes.length);
        }
        else {
            let count = toCount(rows);
            if (this.edgeCursor) {
                res.edges = new Array(Math.min(this.limit, count));
                for (let i = 0; i < res.edges.length; i++) {
                    res.edges[i] = {
                        cursor: (0, connection_1.encodeRelayConnectionCursor)(this.offset + i + 1)
                    };
                }
            }
            res.pageInfo = this.getPageInfo(count);
            res.totalCount = this.getTotalCount(count);
        }
        return res;
    }
    getPageInfo(count) {
        if (!this.pageInfo)
            return;
        return {
            hasNextPage: count > this.limit,
            hasPreviousPage: count > 0 && this.offset > 0,
            startCursor: count > 0 ? (0, connection_1.encodeRelayConnectionCursor)(this.offset + 1) : '',
            endCursor: count > 0 ? (0, connection_1.encodeRelayConnectionCursor)(this.offset + Math.min(this.limit, count)) : ''
        };
    }
    getTotalCount(count) {
        if (!this.totalCount)
            return;
        if (count > 0 && count <= this.limit) {
            return this.offset + count;
        }
        else {
            return undefined;
        }
    }
}
exports.ConnectionQuery = ConnectionQuery;
function toCount(rows) {
    (0, assert_1.default)(rows.length == 1);
    return (0, util_1.toSafeInteger)(rows[0][0]);
}
//# sourceMappingURL=query.js.map