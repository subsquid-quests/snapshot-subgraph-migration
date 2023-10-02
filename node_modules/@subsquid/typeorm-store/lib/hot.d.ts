import type { EntityManager } from 'typeorm';
import { Entity, EntityClass } from './store';
export interface RowRef {
    table: string;
    id: string;
}
export interface InsertRecord extends RowRef {
    kind: 'insert';
}
export interface DeleteRecord extends RowRef {
    kind: 'delete';
    fields: Record<string, any>;
}
export interface UpdateRecord extends RowRef {
    kind: 'update';
    fields: Record<string, any>;
}
export type ChangeRecord = InsertRecord | UpdateRecord | DeleteRecord;
export interface ChangeRow {
    block_height: number;
    index: number;
    change: ChangeRecord;
}
export declare class ChangeTracker {
    private em;
    private statusSchema;
    private blockHeight;
    private index;
    constructor(em: EntityManager, statusSchema: string, blockHeight: number);
    trackInsert(type: EntityClass<Entity>, entities: Entity[]): Promise<void>;
    trackUpsert(type: EntityClass<Entity>, entities: Entity[]): Promise<void>;
    trackDelete(type: EntityClass<Entity>, ids: string[]): Promise<void>;
    private fetchEntities;
    private writeChangeRows;
    private getEntityMetadata;
    private escape;
}
export declare function rollbackBlock(statusSchema: string, em: EntityManager, blockHeight: number): Promise<void>;
//# sourceMappingURL=hot.d.ts.map