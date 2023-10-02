import { OrderBy, Where } from './args';
export interface RelayConnectionRequest<R> {
    orderBy: OrderBy;
    where?: Where;
    first?: number;
    after?: string;
    edgeNode?: R;
    edgeCursor?: boolean;
    pageInfo?: boolean;
    totalCount?: boolean;
}
export interface RelayConnectionResponse {
    edges?: RelayConnectionEdge[];
    pageInfo?: Partial<RelayConnectionPageInfo>;
    totalCount?: number;
}
export interface RelayConnectionEdge {
    node?: unknown;
    cursor?: string;
}
export interface RelayConnectionPageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
}
export declare function decodeRelayConnectionCursor(cursor: string): number | undefined;
export declare function encodeRelayConnectionCursor(val: number): string;
//# sourceMappingURL=connection.d.ts.map