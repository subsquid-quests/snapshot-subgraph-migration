import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Delegation, Sig, Block } from "./model";
import {
  CONTRACT_ADDRESS_DELEGATE,
  CONTRACT_ADDRESS_GNOSIS_SAFE_V1_0_0,
  CONTRACT_ADDRESS_GNOSIS_SAFE_V1_1_1,
  CONTRACT_ADDRESS_GNOSIS_SAFE_V1_3_0,
  processor,
} from "./processor";
import { decodeHex } from "@subsquid/evm-processor";
import * as DelegateRegistry from "./abi/DelegateRegistry";
import * as GnosisSafe from "./abi/GnosisSafe";

// Define a type for the return value of getDataFromLogs
type SetDelegateEventData = {
  type: "SetDelegate";
  id: string;
  delegator: Buffer;
  space: string;
  delegate: Buffer;
  timestamp: number;
};

type ClearDelegateEventData = {
  type: "ClearDelegate";
  id: string;
  timestamp: bigint;
};

type SignMsgEventData = {
  type: "SignMsg";
  id: any;
  account: Buffer;
  msgHash: string;
  timestamp: bigint;
};

type EventData =
  | SetDelegateEventData
  | ClearDelegateEventData
  | SignMsgEventData
  | undefined;

// Helper function to decode event logs
function getDataFromLogs(log: any): EventData {
  const eventDecoders: Record<string, () => EventData> = {
    [DelegateRegistry.events.SetDelegate.topic]: () => {
      const { delegator, id, delegate } =
        DelegateRegistry.events.SetDelegate.decode(log);
      const space = id;
      const eventId = `${delegator}-${space}-${delegate}`;
      return {
        type: "SetDelegate",
        id: eventId,
        delegator: decodeHex(delegator),
        space: space,
        delegate: decodeHex(delegate),
        timestamp: log.block.timestamp / 1000,
      };
    },
    [DelegateRegistry.events.ClearDelegate.topic]: () => {
      const { delegator, id, delegate } =
        DelegateRegistry.events.ClearDelegate.decode(log);
      const space = id;
      const eventId = `${delegator}-${space}-${delegate}`;
      return {
        type: "ClearDelegate",
        id: eventId,
        timestamp: BigInt(log.block.timestamp / 1000),
      };
    },
    [GnosisSafe.events.SignMsg.topic]: () => {
      const { msgHash } = GnosisSafe.events.SignMsg.decode(log);
      return {
        type: "SignMsg",
        id: log.transaction?.hash,
        account: decodeHex(log.address),
        msgHash: msgHash,
        timestamp: BigInt(log.block.timestamp / 1000), // Convert timestamp to seconds
      };
    },
  };

  const eventDecoder = eventDecoders[log.topics[0]];

  if (eventDecoder) {
    return eventDecoder();
  }

  return undefined; // Return undefined if no matching event is found
}

// Main processing logic
processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const delegations = new Map();
  const sigs = new Map();
  const clearDelegations = [];

  for (let block of ctx.blocks) {
    const newBlock = new Block({
      id: block.header.hash,
      number: BigInt(block.header.height),
      timestamp: BigInt(block.header.timestamp),
    });
    await ctx.store.upsert([newBlock]);

    for (let log of block.logs) {
      const eventData = getDataFromLogs(log);
      if (eventData) {
        if (log.address === CONTRACT_ADDRESS_DELEGATE) {
          if (eventData.type === "SetDelegate") {
            delegations.set(
              eventData.id,
              new Delegation({
                id: eventData.id,
                delegator: eventData.delegator,
                space: eventData.space,
                delegate: eventData.delegate,
                timestamp: eventData.timestamp,
              })
            );
          } else {
            clearDelegations.push(eventData.id);
          }
        }
        if (
          log.address in
            [
              CONTRACT_ADDRESS_GNOSIS_SAFE_V1_0_0,
              CONTRACT_ADDRESS_GNOSIS_SAFE_V1_1_1,
              CONTRACT_ADDRESS_GNOSIS_SAFE_V1_3_0,
            ] &&
          eventData.type === "SignMsg"
        ) {
          sigs.set(
            eventData.id,
            new Sig({
              id: eventData.id,
              account: eventData.account,
              msgHash: eventData.msgHash,
              timestamp: eventData.timestamp,
            })
          );
        }
      }
    }
  }

  await ctx.store.upsert([...delegations.values()]);
  await ctx.store.upsert([...sigs.values()]);
  if (clearDelegations.length != 0) {
    await ctx.store.remove(Delegation, [...clearDelegations]);
  }
});
