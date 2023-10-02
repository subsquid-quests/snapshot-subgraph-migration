import { GraphQLResolveInfo, GraphQLSchema } from "graphql";
import { ResolveTree } from "graphql-parse-resolve-info";
export type ResolveTreeFields = {
    [alias: string]: ResolveTree;
};
export interface ResolveTreeWithFields extends ResolveTree {
    fields: ResolveTreeFields;
}
export declare function simplifyResolveTree(schema: GraphQLSchema, tree: ResolveTree, typeName: string): ResolveTreeWithFields;
export declare function getResolveTree(info: GraphQLResolveInfo): ResolveTree;
export declare function getResolveTree(info: GraphQLResolveInfo, typeName: string): ResolveTreeWithFields;
export declare function getTreeRequest(treeFields: ResolveTreeFields, fieldName: string): ResolveTree | undefined;
export declare function hasTreeRequest(treeFields: ResolveTreeFields, fieldName: string): boolean;
//# sourceMappingURL=resolve-tree.d.ts.map