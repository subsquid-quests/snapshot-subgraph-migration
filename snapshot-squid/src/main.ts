import { TypeormDatabase } from '@subsquid/typeorm-store'
import { DELEGATE_CONTRACT, GNOSIS_SAFE_V1_0_0_CONTRACT, GNOSIS_SAFE_V1_1_1_CONTRACT, GNOSIS_SAFE_V1_3_0_CONTRACT, processor } from './processor'
import { Log, decodeHex } from '@subsquid/evm-processor';
import { EventType } from './types';
import { Block, Delegation, Sig } from './model';

import { events as GnosisSafeEvent } from './abi/GnosisSafe'
import { events as DelegateRegistryEvent } from './abi/DelegateRegistry'

function createEventId(delegator: string, space: string, delegate: string): string {
  return `${delegator}-${space}-${delegate}`;
}

function extractData(log: Log): EventType {
  if (log.topics[0] === DelegateRegistryEvent.SetDelegate.topic) {
    const { delegator, id, delegate } = DelegateRegistryEvent.SetDelegate.decode(log);
    const space = id;
    const eventId = createEventId(delegator, space, delegate);

    return {
      type: "setDelegate",
      id: eventId,
      delegator: decodeHex(delegator),
      space: space,
      delegate: decodeHex(delegate),
      timestamp: log.block.timestamp / 1000,
    };
  }

  if (log.topics[0] === DelegateRegistryEvent.SetDelegate.topic) {
    const { delegator, id, delegate } =
      DelegateRegistryEvent.ClearDelegate.decode(log);
    const space = id;
    const eventId = createEventId(delegator, space, delegate);

    return {
      type: "clearDelegate",
      id: eventId,
      timestamp: BigInt(log.block.timestamp / 1000),
    };
  }

  if (log.topics[0] === GnosisSafeEvent.SignMsg.topic) {

    const { msgHash } = GnosisSafeEvent.SignMsg.decode(log);

    return {
      type: "signMsg",
      id: log.transaction?.hash,
      account: decodeHex(log.address),
      msgHash: msgHash,
      timestamp: BigInt(log.block.timestamp / 1000),
    };
  }

  if (log.topics[0] === GnosisSafeEvent.SignMsg.topic) {

    const { msgHash } = GnosisSafeEvent.SignMsg.decode(log);

    return {
      type: "signMsg",
      id: log.transaction?.hash,
      account: decodeHex(log.address),
      msgHash: msgHash,
      timestamp: BigInt(log.block.timestamp / 1000),
    };
  }

  return undefined
}

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const delegations: Map<string, Delegation> = new Map()
  const sigs: Map<string, Sig> = new Map()
  const clearDelegations = [];

  for (const block of ctx.blocks) {
    const blockEntity = new Block({
      id: block.header.hash,
      number: BigInt(block.header.height),
      timestamp: BigInt(block.header.timestamp)
    })
    //save new block
    await ctx.store.upsert(blockEntity);

    for (const log of block.logs) {
      // extract data from log
      const data = extractData(log)

      if (!data) continue
      if (log.address === DELEGATE_CONTRACT) {
        if (data.type === "setDelegate") {
          delegations.set(
            data.id,
            new Delegation({
              id: data.id,
              delegator: data.delegator,
              space: data.space,
              delegate: data.delegate,
              timestamp: data.timestamp,
            })
          );
        } else {
          clearDelegations.push(data.id);
        }
      }
      if (
        log.address in
        [
          GNOSIS_SAFE_V1_3_0_CONTRACT,
          GNOSIS_SAFE_V1_1_1_CONTRACT,
          GNOSIS_SAFE_V1_0_0_CONTRACT,
        ] &&
        data.type === "signMsg"
      ) {
        sigs.set(
          data.id,
          new Sig({
            id: data.id,
            account: data.account,
            msgHash: data.msgHash,
            timestamp: data.timestamp,
          })
        );
      }
    }
  }

  // // upsert batches of delegations with batch-optimized ctx.store.upsert
  await ctx.store.upsert([...delegations.values()]);
  await ctx.store.upsert([...sigs.values()]);
  if (clearDelegations.length != 0) {
    await ctx.store.remove(Delegation, [...clearDelegations]);
  }
})
