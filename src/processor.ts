import { lookupArchive } from "@subsquid/archive-registry";
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from "@subsquid/evm-processor";
import * as DelegateRegistry from "./abi/DelegateRegistry";
import * as GnosisSafe from "./abi/GnosisSafe";
import * as GnosisSafeProxyFactory_v100 from "./abi/GnosisSafeProxyFactory_v1.0.0";
import * as GnosisSafeProxyFactory_111 from "./abi/GnosisSafeProxyFactory_v1.1.1";
import * as GnosisSafeProxyFactory_v130 from "./abi/GnosisSafeProxyFactory_v1.3.0";

export const CONTRACT_ADDRESS_DELEGATE =
  "0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446".toLowerCase();
export const CONTRACT_ADDRESS_GNOSIS_SAFE_V1_0_0 =
  "0x12302fE9c02ff50939BaAaaf415fc226C078613C".toLowerCase();
export const CONTRACT_ADDRESS_GNOSIS_SAFE_V1_1_1 =
  "0x76E2cFc1F5Fa8F6a5b3fC4c8F4788F0116861F9B".toLowerCase();
export const CONTRACT_ADDRESS_GNOSIS_SAFE_V1_3_0 =
  "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2".toLowerCase();

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive("eth-mainnet"),
    chain: "https://rpc.ankr.com/eth",
  })
  .setFinalityConfirmation(75)
  .setFields({
    transaction: {
      from: true,
      value: true,
      hash: true,
    },
  })
  .setBlockRange({
    from: 11_225_329,
  })
  .addLog({
    address: [CONTRACT_ADDRESS_DELEGATE],
    topic0: [
      DelegateRegistry.events.ClearDelegate.topic,
      DelegateRegistry.events.SetDelegate.topic,
    ],
  })
  .addLog({
    address: [
      CONTRACT_ADDRESS_GNOSIS_SAFE_V1_0_0,
      CONTRACT_ADDRESS_GNOSIS_SAFE_V1_1_1,
      CONTRACT_ADDRESS_GNOSIS_SAFE_V1_3_0,
    ],
    topic0: [GnosisSafe.events.SignMsg.topic],
  })
  .addLog({
    address: [CONTRACT_ADDRESS_GNOSIS_SAFE_V1_0_0],
    topic0: [GnosisSafeProxyFactory_v100.events.ProxyCreation.topic],
  })
  .addLog({
    address: [CONTRACT_ADDRESS_GNOSIS_SAFE_V1_1_1],
    topic0: [GnosisSafeProxyFactory_111.events.ProxyCreation.topic],
  })
  .addLog({
    address: [CONTRACT_ADDRESS_GNOSIS_SAFE_V1_3_0],
    topic0: [GnosisSafeProxyFactory_v130.events.ProxyCreation.topic],
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
