import { Client } from "gql-test-client";
import { ClientBase } from "pg";
import { ServerOptions } from '../server';
export declare function isCockroach(): boolean;
export declare const db_config: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
};
export declare function withDatabase(block: (client: ClientBase) => Promise<void>): Promise<void>;
export declare function databaseExecute(sql: string[]): Promise<void>;
export declare function databaseDelete(): Promise<void>;
export declare function useDatabase(sql: string[]): void;
export declare function useServer(schema: string, options?: Partial<ServerOptions>): Client;
//# sourceMappingURL=setup.d.ts.map