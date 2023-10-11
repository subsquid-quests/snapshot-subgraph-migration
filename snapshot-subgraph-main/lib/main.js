"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_store_1 = require("@subsquid/typeorm-store");
const model_1 = require("./model");
const processor_1 = require("./processor");
const DelegateRegistry = __importStar(require("./abi/DelegateRegistry"));
const GnosisSafe = __importStar(require("./abi/GnosisSafe"));
processor_1.processor.run(new typeorm_store_1.TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const sigs = [];
    for (let c of ctx.blocks) {
        await ctx.store.upsert(new model_1.Block({ id: c.header.hash, number: BigInt(c.header.height), timestamp: new Date(c.header.timestamp) }));
        for (let log of c.logs) {
            const delegations = [];
            // decode and normalize the tx data
            if (log.topics[0] === GnosisSafe.events.SignMsg.topic) {
                let { msgHash } = GnosisSafe.events.SignMsg.decode(log);
                let sig = new model_1.Sig({
                    id: log.id,
                    account: log.address,
                    msgHash: msgHash,
                    timestamp: new Date(c.header.timestamp),
                });
                ctx.log.info(`SignMsg: block: ${c.header.height}, ${sig.account}, ${sig.msgHash}, ${sig.timestamp}`);
                sigs.push(sig);
            }
            if (log.topics[0] === DelegateRegistry.events.SetDelegate.topic) {
                let { delegator, id, delegate } = DelegateRegistry.events.SetDelegate.decode(log);
                let delegation = new model_1.Delegation({
                    id: delegator.concat('-').concat(id).concat('-').concat(delegate),
                    delegator: delegator,
                    space: id,
                    delegate: delegate,
                    timestamp: new Date(c.header.timestamp),
                });
                ctx.log.info(`SetDelegate: block: ${c.header.height}, ${delegation.id}, ${delegation.delegator}, ${delegation.space}, ${delegation.delegate}, ${delegation.timestamp}`);
                delegations.push(delegation);
                await ctx.store.upsert(delegations);
            }
            if (log.topics[0] === DelegateRegistry.events.ClearDelegate.topic) {
                let { delegator, id, delegate } = DelegateRegistry.events.ClearDelegate.decode(log);
                let delegation = new model_1.Delegation({
                    id: delegator.concat('-').concat(id).concat('-').concat(delegate),
                    delegator: delegator,
                    space: id,
                    delegate: delegate,
                    timestamp: new Date(c.header.timestamp),
                });
                ctx.log.info(`ClearDelegate: block: ${c.header.height}, ${delegation.id}, ${delegation.delegator}, ${delegation.space}, ${delegation.delegate}, ${delegation.timestamp}`);
                delegations.push(delegation);
                await ctx.store.remove(model_1.Delegation, [delegation.id]);
            }
        }
    }
    // apply vectorized transformations and aggregations
    const startBlock = ctx.blocks.at(0)?.header.height;
    const endBlock = ctx.blocks.at(-1)?.header.height;
    ctx.log.info(`Delegations  ${startBlock} to ${endBlock}`);
    // upsert batches of entities with batch-optimized ctx.store.save
    await ctx.store.upsert(sigs);
});
//# sourceMappingURL=main.js.map