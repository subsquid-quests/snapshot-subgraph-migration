import { Entity, FTS_Query, Interface, JsonObject, Model, Prop, PropType } from './model';
export declare function getUnionProps(model: Model, unionName: string): JsonObject;
export declare function buildUnionProps(model: Model, unionName: string): JsonObject;
export declare function getQueryableEntities(model: Model, queryableName: string): string[];
export declare function getQueryableProperties(model: Model, queryableName: string): Record<string, Prop>;
export declare function getUniversalProperties(model: Model, typeName: string): Record<string, Prop>;
export declare function validateModel(model: Model): void;
export declare function validateNames(model: Model): void;
export declare function validateUnionTypes(model: Model): void;
export declare function validateLookups(model: Model): void;
export declare function validateIndexes(model: Model): void;
export declare function validateQueryableInterfaces(model: Model): void;
export declare function propTypeEquals(a: PropType, b: PropType): boolean;
export declare function getEntity(model: Model, name: string): Entity;
export declare function getObject(model: Model, name: string): JsonObject;
export declare function getInterface(model: Model, name: string): Interface;
export declare function getFtsQuery(model: Model, name: string): FTS_Query;
//# sourceMappingURL=model.tools.d.ts.map