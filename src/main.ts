import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Delegation, Sig, Block } from "./model";
import { CONTRACT_ADDRESS_DELEGATE, processor } from "./processor";
import { decodeHex } from "@subsquid/evm-processor";
import * as DelegateRegistry from "./abi/DelegateRegistry";
import * as GnosisSafe from "./abi/GnosisSafe";

// Create a function to process logs and return data
function getDataFromLogs(log: any) {
  // Define a mapping of event topics to event decoding functions
  const eventDecoders = {
    [DelegateRegistry.events.SetDelegate.topic]: () => {
      const { delegator, id, delegate } =
        DelegateRegistry.events.SetDelegate.decode(log);
      return {
        type: "SetDelegate",
        blockNumber: log.blockNumber,
        block: log.block,
        id: `${delegator}-${id}-${delegate}`,
        delegate: decodeHex(delegate),
        delegator: decodeHex(delegator),
        space: id,
        timestamp: log.block.timestamp / 1000, // Convert timestamp to seconds
      };
    },
    [DelegateRegistry.events.ClearDelegate.topic]: () => {
      const { delegator, id, delegate } =
        DelegateRegistry.events.ClearDelegate.decode(log);
      return {
        type: "ClearDelegate",
        id: `${delegator}-${id}-${delegate}`,
        blockNumber: log.blockNumber,
        delegate: decodeHex(delegate),
        delegator: decodeHex(delegator),
        space: id,
        timestamp: log.block.timestamp / 1000, // Convert timestamp to seconds
      };
    },
    [GnosisSafe.events.SignMsg.topic]: () => {
      const { msgHash } = GnosisSafe.events.SignMsg.decode(log);

      return {
        type: "SignMsg",
        id: log.transaction?.hash,
        blockNumber: log.blockNumber,
        block: log.block,
        msgHash,
        delegator: decodeHex(log.address),
        timestamp: BigInt(log.block.timestamp / 1000), // Convert timestamp to seconds
      };
    },
  };

  const eventDecoder = eventDecoders[log.topics[0]];

  if (eventDecoder) {
    try {
      return eventDecoder();
    } catch (err) {
      console.error("Error decoding event:", err);
    }
  }

  return undefined; // Return undefined if no matching event is found
}

async function addBlockToDatabase(ctx: any, block: any) {
  try {
    console.log("block header", block);
    await ctx.store.insert(
      new Block({
        id: block.hash, // Use block hash as the ID
        number: BigInt(block.height),
        timestamp: BigInt(block.timestamp / 1000), // converted to seconds
      })
    );
  } catch (err) {
    console.error("Error adding block to the database:", err);
  }
}

// Main processing logic
processor.run(
  new TypeormDatabase({ supportHotBlocks: true }),
  async (ctx: {
    blocks: any[];
    store: {
      remove: (arg0: typeof Delegation, arg1: any[]) => any;
      upsert: (arg0: any[]) => any;
    };
  }) => {
    const delegations = new Map();
    const sigs = new Map();
    const clearDelegations = [];

    const batchedLogs = ctx.blocks.flatMap(
      (block: { logs: any }) => block.logs
    );

    const batchedLogsByContract = batchedLogs.reduce(
      (
        logsByContract: { [x: string]: any[] },
        log: { address: string | number }
      ) => {
        if (!logsByContract[log.address]) {
          logsByContract[log.address] = [];
        }
        logsByContract[log.address].push(log);
        return logsByContract;
      },
      {}
    );

    // Batch processing logs for each contract
    for (const [contractAddress, logs] of Object.entries(
      batchedLogsByContract
    )) {
      try {
        // Get data from logs
        const results = (logs as any[])
          .map(getDataFromLogs)
          .filter((result) => result !== undefined) as (
          | {
              type: "SetDelegate" | "ClearDelegate";
              id: string;
              delegate: Buffer;
              delegator: Buffer;
              space: string;
              timestamp: number;
            }
          | {
              type: "SignMsg";
              id: any;
              msgHash: string;
              delegator: Buffer;
              timestamp: bigint;
            }
        )[];

        for (const result of results) {
          if (contractAddress === CONTRACT_ADDRESS_DELEGATE) {
            if (result.type === "ClearDelegate") {
              // Handle ClearDelegate event
              clearDelegations.push(result.id); // Add ID to list of delegations to clear
            } else {
              const setDelegateResult = result as {
                type: "SetDelegate";
                id: string;
                delegate: Buffer;
                delegator: Buffer;
                space: string;
                blockNumber: number;
                block: any;
                timestamp: number;
              };

              // Handle SetDelegate event
              delegations.set(
                setDelegateResult.id,
                new Delegation({
                  id: setDelegateResult.id,
                  delegate: setDelegateResult.delegate,
                  delegator: setDelegateResult.delegator,
                  space: setDelegateResult.space,
                  timestamp: setDelegateResult.timestamp,
                })
              );

              await addBlockToDatabase(ctx, setDelegateResult.block);
            }
          } else {
            // Process as Sig
            const signMsgResult = result as {
              type: "SignMsg";
              id: any;
              msgHash: string;
              delegator: Buffer;
              blockNumber: number;
              block: any;
              timestamp: bigint;
            };

            sigs.set(
              signMsgResult.id,
              new Sig({
                id: signMsgResult.id,
                account: signMsgResult.delegator,
                msgHash: signMsgResult.msgHash,
                timestamp: signMsgResult.timestamp,
              })
            );

            await addBlockToDatabase(ctx, signMsgResult.block);
          }
        }
      } catch (err) {
        console.error("Error processing logs:", err);
      }
    }

    // Remove delegations if ClearDelegate events were detected
    if (clearDelegations.length !== 0) {
      await ctx.store.remove(Delegation, clearDelegations);
    }

    // Upsert batches of entities with batch-optimized ctx.store.save
    await Promise.all([
      ctx.store.upsert([...delegations.values()]),
      ctx.store.upsert([...sigs.values()]),
    ]);
  }
);
