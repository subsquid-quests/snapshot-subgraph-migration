export declare class LazyTransaction<T> {
    private transact;
    private closed;
    private tx?;
    constructor(transact: (f: (ctx: T) => Promise<void>) => Promise<void>);
    get(): Promise<T>;
    private startTransaction;
    close(): Promise<void>;
}
//# sourceMappingURL=lazy-transaction.d.ts.map