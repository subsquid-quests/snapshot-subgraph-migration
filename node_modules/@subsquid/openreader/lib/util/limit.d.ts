export declare class Limit {
    private error;
    private value;
    constructor(error: Error, value: number);
    get left(): number;
    check(cb: (left: number) => number): void;
}
export declare class ResponseSizeLimit extends Limit {
    constructor(maxNodes: number);
}
//# sourceMappingURL=limit.d.ts.map