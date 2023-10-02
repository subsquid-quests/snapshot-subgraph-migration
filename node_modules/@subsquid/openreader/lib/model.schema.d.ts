import { DocumentNode, GraphQLSchema } from 'graphql';
import { Model } from './model';
export declare function buildSchema(doc: DocumentNode): GraphQLSchema;
export declare function buildModel(schema: GraphQLSchema): Model;
export declare class SchemaError extends Error {
}
//# sourceMappingURL=model.schema.d.ts.map