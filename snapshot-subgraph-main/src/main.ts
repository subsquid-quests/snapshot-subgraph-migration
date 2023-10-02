import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Delegation, Block, Sig} from './model'
import {processor} from './processor'
import * as DelegateRegistry from "./abi/DelegateRegistry";
import * as GnosisSafe from "./abi/GnosisSafe";
import { time } from 'console';

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    const PROXYFACTORY100 = '0x12302fE9c02ff50939BaAaaf415fc226C078613C'.toLowerCase()
    const PROXYFACTORY111 = '0x12302fE9c02ff50939BaAaaf415fc226C078613C'.toLowerCase()
    const PROXYFACTORY130 = '0x12302fE9c02ff50939BaAaaf415fc226C078613C'.toLowerCase()
    const DELEGATEREGISTRY = '0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446'.toLowerCase()
    const sigs: Sig[] = []
    const delegationsSet: Map<string, Delegation> = new Map()
    const delegationsClear: string[] = []
    for (let c of ctx.blocks) {
        let delegateLog = false
        for (let log of c.logs) {
            // decode and normalize the tx data GnosisSafe
            if(log.topics[0] === GnosisSafe.events.SignMsg.topic) {
                if (![PROXYFACTORY100, PROXYFACTORY111, PROXYFACTORY130].includes(log.address.toLowerCase())) {
                    continue
                }
                let {msgHash} = GnosisSafe.events.SignMsg.decode(log)
                let sig = new Sig({
                    id: log.id,
                    account: log.address,
                    msgHash: msgHash,
                    timestamp: new Date(c.header.timestamp),
                });
                ctx.log.info(`SignMsg: block: ${c.header.height}, ${sig.account}, ${sig.msgHash}, ${sig.timestamp}`);
                sigs.push(sig);
            }
            // decode and normalize the tx data SetDelegate
            if(log.topics[0] === DelegateRegistry.events.SetDelegate.topic) {
                if (log.address.toLowerCase()!=DELEGATEREGISTRY) {
                    continue
                }
                let {delegator, id, delegate} = DelegateRegistry.events.SetDelegate.decode(log);
                let space = id;
                id  = delegator.concat('-').concat(id).concat('-').concat(delegate).concat('').concat(c.header.timestamp.toString());
                ctx.log.info(`SetDelegate: block: ${c.header.height}, ${id}, ${delegator}, ${space}, ${delegate}`);
                delegationsSet.set(id, new Delegation({
                    id: id,
                    delegator: delegator,
                    space: space,
                    delegate: delegate,
                    timestamp: new Date(c.header.timestamp),
                }))
                delegateLog = true
            }
            // decode and normalize the tx data ClearDelegate
            if(log.topics[0] === DelegateRegistry.events.ClearDelegate.topic) {
                if (log.address.toLowerCase()!=DELEGATEREGISTRY) {
                    continue
                }
                let {delegator, id, delegate} = DelegateRegistry.events.ClearDelegate.decode(log);
                let space = id;
                id  = delegator.concat('-').concat(id).concat('-').concat(delegate).concat('').concat(c.header.timestamp.toString());
                ctx.log.info(`ClearDelegate: block: ${c.header.height}, ${id}, ${delegator}, ${space}, ${delegate}`);
                delegationsClear.push(id);
                delegateLog = true
            }
        }
        if (delegateLog === true) {
            await ctx.store.upsert(new Block({id: c.header.hash, number: BigInt(c.header.height), timestamp: new Date(c.header.timestamp)}));
        }
    }
    // apply vectorized transformations and aggregations
    const startBlock = ctx.blocks.at(0)?.header.height
    const endBlock = ctx.blocks.at(-1)?.header.height
    ctx.log.info(`Blocks:  ${startBlock} to ${endBlock}`)

    // upsert batches of entities with batch-optimized ctx.store.save
    await ctx.store.upsert(sigs);
    await ctx.store.upsert([...delegationsSet.values()]);
    if (delegationsClear.length != 0) {await ctx.store.remove(Delegation, [...delegationsClear]);}
});
