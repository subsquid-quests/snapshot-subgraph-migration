import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Block, Delegation, Sig } from "./model";
import { CONTRACT_ADDRESS_DELEGATE, processor } from "./processor";
import { decodeHex } from "@subsquid/evm-processor";
import * as DelegateRegistry from "./abi/DelegateRegistry";
import * as GnosisSafe from "./abi/GnosisSafe";

// Create a function to process logs and return data
function getDataFromLogs(log: any):
  | {
      id: string;
      delegate?: any;
      delegator: any;
      space?: string;
      msgHash?: string;
      timestamp: any;
    }
  | undefined {
  // Check if the log matches the SetDelegate event from DelegateRegistry
  if (log.topics[0] === DelegateRegistry.events.SetDelegate.topic) {
    let { delegator, id, delegate } =
      DelegateRegistry.events.SetDelegate.decode(log);

    // Convert the string addresses to Uint8Array
    let delegatorBytes = decodeHex(delegator);
    let delegateBytes = decodeHex(delegate);
    let space = id;
    let timestamp = log.block.timestamp / 1000; // Convert timestamp to seconds

    let idString = delegator
      .concat("-")
      .concat(space)
      .concat("-")
      .concat(delegate);

    return {
      id: idString,
      delegate: delegateBytes,
      delegator: delegatorBytes,
      space,
      timestamp,
    };
  }
  // Check if the log matches the ClearDelegate event from DelegateRegistry
  if (log.topics[0] === DelegateRegistry.events.ClearDelegate.topic) {
    let { delegator, id, delegate } =
      DelegateRegistry.events.SetDelegate.decode(log);

    // Convert the string addresses to Uint8Array
    let delegatorBytes = decodeHex(delegator);
    let delegateBytes = decodeHex(delegate);
    let space = id;
    let timestamp = log.block.timestamp / 1000; // Convert timestamp to seconds

    let idString = delegator
      .concat("-")
      .concat(space)
      .concat("-")
      .concat(delegate);

    return {
      id: idString,
      delegate: delegateBytes,
      delegator: delegatorBytes,
      space,
      timestamp,
    };
  }
  // Check if the log matches the SignMsg event from GnosisSafe
  if (log.topics[0] === GnosisSafe.events.SignMsg.topic) {
    let { msgHash } = GnosisSafe.events.SignMsg.decode(log);
    let delegatorBytes = decodeHex(log.address);
    let id = log.transaction?.hash;
    let timestamp = BigInt(log.block.timestamp / 1000); // Convert timestamp to seconds

    return { id, msgHash, delegator: delegatorBytes, timestamp };
  }

  return undefined; // Return undefined if no matching event is found
}

// Main processing logic
processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const delegations: Map<string, Delegation> = new Map();
  const sigs: Map<string, Sig> = new Map();
  const clearDelegations: string[] = [];

  // Iterate through blocks and logs
  for (let c of ctx.blocks) {
    for (let log of c.logs) {
      if (log.topics[0] == GnosisSafe.events.SignMsg.topic) {
        let result = getDataFromLogs(log);

        if (result !== undefined) {
          // Process as Sig
          let sig = new Sig({
            id: result.id,
            account: result.delegator,
            msgHash: result.msgHash,
            timestamp: result.timestamp,
          });
          sigs.set(result.id, sig);

          ctx.log.info(
            `SignMsg: [id: ${result.id}, account: ${log.address}], msgHash: ${result.msgHash}`
          );
        }
      }
      if (log.address === CONTRACT_ADDRESS_DELEGATE) {
        try {
          // Get data from logs
          let result = getDataFromLogs(log);

          if (result !== undefined) {
            if (log.topics[0] === DelegateRegistry.events.ClearDelegate.topic) {
              // Handle ClearDelegate event
              clearDelegations.push(result.id); // Add ID to list of delegations to clear
            } else {
              // Handle SetDelegate event
              let delegation = new Delegation({
                id: result.id,
                delegate: result.delegate,
                delegator: result.delegator,
                space: result.space,
                timestamp: result.timestamp,
              });

              delegations.set(result.id, delegation);

              ctx.log.info(
                `Delegation: [id: ${result.id}, delegator: ${result.delegator}], space: ${result.space}, delegate: ${result.delegate}`
              );
            }
          }
        } catch (err) {
          console.error("Error processing log:", err);
        }
      }
    }
  }

  // Remove delegations if ClearDelegate events were detected
  if (clearDelegations.length !== 0) {
    await ctx.store.remove(Delegation, clearDelegations);
  }

  // upsert batches of entities with batch-optimized ctx.store.save
  await Promise.all([
    ctx.store.upsert([...delegations.values()]),
    ctx.store.upsert([...sigs.values()]),
  ]);
});
