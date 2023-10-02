import { Where } from './ir/args';
import { RelayConnectionRequest } from './ir/connection';
import { AnyFields, FieldRequest } from './ir/fields';
import { Model } from './model';
export declare function getObjectSize(model: Model, fields: FieldRequest[]): number;
export declare function getListSize(model: Model, typeName: string, fields: AnyFields, limit?: number, where?: Where): number;
export declare function getConnectionSize(model: Model, typeName: string, req: RelayConnectionRequest<AnyFields>): number;
//# sourceMappingURL=limit.size.d.ts.map