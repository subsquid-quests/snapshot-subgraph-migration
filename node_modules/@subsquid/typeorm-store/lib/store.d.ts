import { EntityManager, FindOptionsOrder, FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { ChangeTracker } from './hot';
export interface EntityClass<T> {
    new (): T;
}
export interface Entity {
    id: string;
}
/**
 * Defines a special criteria to find specific entity.
 */
export interface FindOneOptions<Entity = any> {
    /**
     * Adds a comment with the supplied string in the generated query.  This is
     * helpful for debugging purposes, such as finding a specific query in the
     * database server's logs, or for categorization using an APM product.
     */
    comment?: string;
    /**
     * Simple condition that should be applied to match entities.
     */
    where?: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>;
    /**
     * Indicates what relations of entity should be loaded (simplified left join form).
     */
    relations?: FindOptionsRelations<Entity>;
    /**
     * Order, in which entities should be ordered.
     */
    order?: FindOptionsOrder<Entity>;
}
export interface FindManyOptions<Entity = any> extends FindOneOptions<Entity> {
    /**
     * Offset (paginated) where from entities should be taken.
     */
    skip?: number;
    /**
     * Limit (paginated) - max number of entities should be taken.
     */
    take?: number;
}
/**
 * Restricted version of TypeORM entity manager for squid data handlers.
 */
export declare class Store {
    private em;
    private changes?;
    constructor(em: () => EntityManager, changes?: ChangeTracker | undefined);
    /**
     * Alias for {@link Store.upsert}
     */
    save<E extends Entity>(entity: E): Promise<void>;
    save<E extends Entity>(entities: E[]): Promise<void>;
    /**
     * Upserts a given entity or entities into the database.
     *
     * It always executes a primitive operation without cascades, relations, etc.
     */
    upsert<E extends Entity>(entity: E): Promise<void>;
    upsert<E extends Entity>(entities: E[]): Promise<void>;
    private saveMany;
    private getFkSignature;
    private upsertMany;
    /**
     * Inserts a given entity or entities into the database.
     * Does not check if the entity(s) exist in the database and will fail if a duplicate is inserted.
     *
     * Executes a primitive INSERT operation without cascades, relations, etc.
     */
    insert<E extends Entity>(entity: E): Promise<void>;
    insert<E extends Entity>(entities: E[]): Promise<void>;
    /**
     * Deletes a given entity or entities from the database.
     *
     * Unlike {@link EntityManager.remove} executes a primitive DELETE query without cascades, relations, etc.
     */
    remove<E extends Entity>(entity: E): Promise<void>;
    remove<E extends Entity>(entities: E[]): Promise<void>;
    remove<E extends Entity>(entityClass: EntityClass<E>, id: string | string[]): Promise<void>;
    count<E extends Entity>(entityClass: EntityClass<E>, options?: FindManyOptions<E>): Promise<number>;
    countBy<E extends Entity>(entityClass: EntityClass<E>, where: FindOptionsWhere<E> | FindOptionsWhere<E>[]): Promise<number>;
    find<E extends Entity>(entityClass: EntityClass<E>, options?: FindManyOptions<E>): Promise<E[]>;
    findBy<E extends Entity>(entityClass: EntityClass<E>, where: FindOptionsWhere<E> | FindOptionsWhere<E>[]): Promise<E[]>;
    findOne<E extends Entity>(entityClass: EntityClass<E>, options: FindOneOptions<E>): Promise<E | undefined>;
    findOneBy<E extends Entity>(entityClass: EntityClass<E>, where: FindOptionsWhere<E> | FindOptionsWhere<E>[]): Promise<E | undefined>;
    findOneOrFail<E extends Entity>(entityClass: EntityTarget<E>, options: FindOneOptions<E>): Promise<E>;
    findOneByOrFail<E extends Entity>(entityClass: EntityTarget<E>, where: FindOptionsWhere<E> | FindOptionsWhere<E>[]): Promise<E>;
    get<E extends Entity>(entityClass: EntityClass<E>, optionsOrId: FindOneOptions<E> | string): Promise<E | undefined>;
}
//# sourceMappingURL=store.d.ts.map