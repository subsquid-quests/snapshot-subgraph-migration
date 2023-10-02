export declare class Subscription<T> implements AsyncIterator<T>, AsyncIterable<T> {
    private interval;
    private poll;
    private timer?;
    private prev?;
    private hasNoVal;
    constructor(interval: number, poll: () => Promise<T>);
    [Symbol.asyncIterator](): this;
    next(): Promise<{
        done: boolean;
        value: T;
    }>;
    return(): Promise<{
        done: boolean;
        readonly value: any;
    }>;
}
//# sourceMappingURL=subscription.d.ts.map