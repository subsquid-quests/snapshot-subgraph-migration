import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { Block, Delegation, Sig } from "./model";
import { processor, CONTRACT_ADDRESS_DELEGATE } from "./processor";
import * as DelegateRegistry from "./abi/DelegateRegistry";
import * as GnosisSafe from "./abi/GnosisSafe";
import { decodeHex } from "@subsquid/evm-processor";

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  let delegations: Map<string, Delegation>= new Map;
  let clearDelegations: string[] = [];
  let sigs: Sig[] = [];

  for (let block of ctx.blocks) {
    await ctx.store.insert(
      new Block({
        id: block.header.hash,
        number: BigInt(block.header.height),
        timestamp: BigInt(block.header.timestamp),
      })
    );
    for (let log of block.logs) {
      // decode and normalize the tx data
      if (log.topics[0] == GnosisSafe.events.SignMsg.topic) {
        let { msgHash } = GnosisSafe.events.SignMsg.decode(log);
        sigs.push(
          new Sig({
            id: log.id,
            account: decodeHex(log.address),
            msgHash: msgHash,
            timestamp: BigInt(block.header.timestamp),
          })
        );
        ctx.log.info(`SignMsg: [id: ${log.id}, account: ${log.address}], msgHash: ${msgHash}`);
      }

      if (log.address == CONTRACT_ADDRESS_DELEGATE) {
        if (log.topics[0] == DelegateRegistry.events.SetDelegate.topic) {
          let { delegator, id, delegate } =
            DelegateRegistry.events.SetDelegate.decode(log);
          let space = id;
          id = delegator.concat("-").concat(space).concat("-").concat(delegate);
          delegations.set(id, 
            new Delegation({
              id: id,
              delegator: decodeHex(delegator),
              space: space,
              delegate: decodeHex(delegate),
              timestamp: BigInt(block.header.timestamp),
            })
          );
          ctx.log.info(`SetDelegate: [id: ${id}, delegator: ${delegator}], space: ${space}, delegate: ${delegate}`);
        }

        if (log.topics[0] == DelegateRegistry.events.ClearDelegate.topic) {
          let { delegator, id, delegate } =
            DelegateRegistry.events.ClearDelegate.decode(log);
          let space = id;
          id = delegator.concat("-").concat(space).concat("-").concat(delegate);
          clearDelegations.push(id);
          ctx.log.info(`ClearDelegate: [id: ${id}, delegator: ${delegator}], space: ${space}, delegate: ${delegate}`);
        }
      }
    }
  }

  await ctx.store.upsert([...delegations.values()]);
  await ctx.store.upsert(sigs);
  if (clearDelegations.length != 0) {
    await ctx.store.remove(Delegation, [...clearDelegations]);
  }
});
