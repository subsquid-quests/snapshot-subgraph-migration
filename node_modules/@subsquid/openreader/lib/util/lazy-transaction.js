"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyTransaction = void 0;
class LazyTransaction {
    constructor(transact) {
        this.transact = transact;
        this.closed = false;
    }
    async get() {
        if (this.closed) {
            throw new Error("Too late to request transaction");
        }
        this.tx = this.tx || this.startTransaction();
        let { ctx } = await this.tx;
        return ctx;
    }
    async startTransaction() {
        return new Promise((resolve, reject) => {
            let promise = this.transact(ctx => {
                return new Promise(close => {
                    resolve({
                        ctx,
                        close: () => {
                            close();
                            return promise;
                        }
                    });
                });
            });
            promise.catch(err => reject(err));
        });
    }
    async close() {
        this.closed = true;
        if (this.tx) {
            let tx = this.tx;
            this.tx = undefined;
            await tx.then(tx => tx.close());
        }
    }
}
exports.LazyTransaction = LazyTransaction;
//# sourceMappingURL=lazy-transaction.js.map