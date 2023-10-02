"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const deep_equal_1 = __importDefault(require("deep-equal"));
class Subscription {
    constructor(interval, poll) {
        this.interval = interval;
        this.poll = poll;
        this.hasNoVal = true;
    }
    [Symbol.asyncIterator]() {
        return this;
    }
    async next() {
        if (this.hasNoVal) {
            this.prev = await this.poll();
            this.hasNoVal = false;
            return { done: false, value: this.prev };
        }
        let value;
        do {
            await new Promise(resolve => {
                this.timer = setTimeout(() => {
                    this.timer = undefined;
                    resolve();
                }, this.interval);
            });
            value = await this.poll();
        } while ((0, deep_equal_1.default)(this.prev, value));
        this.prev = value;
        return { done: false, value };
    }
    async return() {
        if (this.timer != null) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
        return EOS;
    }
}
exports.Subscription = Subscription;
const EOS = {
    done: true,
    get value() {
        throw new Error('Unexpected value access');
    }
};
//# sourceMappingURL=subscription.js.map