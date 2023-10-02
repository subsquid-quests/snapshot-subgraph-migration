"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const assert_1 = __importDefault(require("assert"));
/**
 * Restricted version of TypeORM entity manager for squid data handlers.
 */
class Store {
    constructor(em, changes) {
        this.em = em;
        this.changes = changes;
    }
    save(e) {
        if (Array.isArray(e)) { // please the compiler
            return this.upsert(e);
        }
        else {
            return this.upsert(e);
        }
    }
    async upsert(e) {
        if (Array.isArray(e)) {
            if (e.length == 0)
                return;
            let entityClass = e[0].constructor;
            for (let i = 1; i < e.length; i++) {
                (0, assert_1.default)(entityClass === e[i].constructor, 'mass saving allowed only for entities of the same class');
            }
            await this.changes?.trackUpsert(entityClass, e);
            await this.saveMany(entityClass, e);
        }
        else {
            let entityClass = e.constructor;
            await this.changes?.trackUpsert(entityClass, [e]);
            await this.em().upsert(entityClass, e, ['id']);
        }
    }
    async saveMany(entityClass, entities) {
        (0, assert_1.default)(entities.length > 0);
        let em = this.em();
        let metadata = em.connection.getMetadata(entityClass);
        let fk = metadata.columns.filter(c => c.relationMetadata);
        if (fk.length == 0)
            return this.upsertMany(em, entityClass, entities);
        let currentSignature = this.getFkSignature(fk, entities[0]);
        let batch = [];
        for (let e of entities) {
            let sig = this.getFkSignature(fk, e);
            if (sig === currentSignature) {
                batch.push(e);
            }
            else {
                await this.upsertMany(em, entityClass, batch);
                currentSignature = sig;
                batch = [e];
            }
        }
        if (batch.length) {
            await this.upsertMany(em, entityClass, batch);
        }
    }
    getFkSignature(fk, entity) {
        let sig = 0n;
        for (let i = 0; i < fk.length; i++) {
            let bit = fk[i].getEntityValue(entity) === undefined ? 0n : 1n;
            sig |= (bit << BigInt(i));
        }
        return sig;
    }
    async upsertMany(em, entityClass, entities) {
        for (let b of splitIntoBatches(entities, 1000)) {
            await em.upsert(entityClass, b, ['id']);
        }
    }
    async insert(e) {
        if (Array.isArray(e)) {
            if (e.length == 0)
                return;
            let entityClass = e[0].constructor;
            for (let i = 1; i < e.length; i++) {
                (0, assert_1.default)(entityClass === e[i].constructor, 'mass saving allowed only for entities of the same class');
            }
            await this.changes?.trackInsert(entityClass, e);
            for (let b of splitIntoBatches(e, 1000)) {
                await this.em().insert(entityClass, b);
            }
        }
        else {
            let entityClass = e.constructor;
            await this.changes?.trackInsert(entityClass, [e]);
            await this.em().insert(entityClass, e);
        }
    }
    async remove(e, id) {
        if (id == null) {
            if (Array.isArray(e)) {
                if (e.length == 0)
                    return;
                let entityClass = e[0].constructor;
                for (let i = 1; i < e.length; i++) {
                    (0, assert_1.default)(entityClass === e[i].constructor, 'mass deletion allowed only for entities of the same class');
                }
                let ids = e.map(i => i.id);
                await this.changes?.trackDelete(entityClass, ids);
                await this.em().delete(entityClass, ids);
            }
            else {
                let entity = e;
                let entityClass = entity.constructor;
                await this.changes?.trackDelete(entityClass, [entity.id]);
                await this.em().delete(entityClass, entity.id);
            }
        }
        else {
            let entityClass = e;
            await this.changes?.trackDelete(entityClass, Array.isArray(id) ? id : [id]);
            await this.em().delete(entityClass, id);
        }
    }
    async count(entityClass, options) {
        return this.em().count(entityClass, options);
    }
    async countBy(entityClass, where) {
        return this.em().countBy(entityClass, where);
    }
    async find(entityClass, options) {
        return this.em().find(entityClass, options);
    }
    async findBy(entityClass, where) {
        return this.em().findBy(entityClass, where);
    }
    async findOne(entityClass, options) {
        return this.em().findOne(entityClass, options).then(noNull);
    }
    async findOneBy(entityClass, where) {
        return this.em().findOneBy(entityClass, where).then(noNull);
    }
    async findOneOrFail(entityClass, options) {
        return this.em().findOneOrFail(entityClass, options);
    }
    async findOneByOrFail(entityClass, where) {
        return this.em().findOneByOrFail(entityClass, where);
    }
    get(entityClass, optionsOrId) {
        if (typeof optionsOrId == 'string') {
            return this.findOneBy(entityClass, { id: optionsOrId });
        }
        else {
            return this.findOne(entityClass, optionsOrId);
        }
    }
}
exports.Store = Store;
function* splitIntoBatches(list, maxBatchSize) {
    if (list.length <= maxBatchSize) {
        yield list;
    }
    else {
        let offset = 0;
        while (list.length - offset > maxBatchSize) {
            yield list.slice(offset, offset + maxBatchSize);
            offset += maxBatchSize;
        }
        yield list.slice(offset);
    }
}
function noNull(val) {
    return val == null ? undefined : val;
}
//# sourceMappingURL=store.js.map