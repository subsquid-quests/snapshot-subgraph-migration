import {lookupArchive} from '@subsquid/archive-registry'
import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor'
import {Store} from '@subsquid/typeorm-store'
import * as DelegateRegistry from "./abi/DelegateRegistry";
import * as GnosisSafe from "./abi/GnosisSafe";
import * as ProxyFactory100 from "./abi/GnosisSafeProxyFactory_v1.0.0";
import * as ProxyFactory111 from "./abi/GnosisSafeProxyFactory_v1.1.1";
import * as ProxyFactory130 from "./abi/GnosisSafeProxyFactory_v1.3.0";
export const processor = new EvmBatchProcessor()
    .setDataSource({
        // Change the Archive endpoints for run the squid
        // against the other EVM networks
        // For a full list of supported networks and config options
        // see https://docs.subsquid.io/evm-indexing/
        archive: lookupArchive('eth-mainnet'),

        // Must be set for RPC ingestion (https://docs.subsquid.io/evm-indexing/evm-processor/)
        // OR to enable contract state queries (https://docs.subsquid.io/evm-indexing/query-state/)
        chain: 'https://rpc.ankr.com/eth',
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
        from: 11_000_000,
    })
    .addLog({
        address: ["0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446"],
        topic0: [DelegateRegistry.events.SetDelegate.topic, DelegateRegistry.events.ClearDelegate.topic],
    })
    .addLog({
        address: ["0x12302fE9c02ff50939BaAaaf415fc226C078613C"],
        topic0: [ProxyFactory100.events.ProxyCreation.topic],
    })
    .addLog({
        address: ["0x76E2cFc1F5Fa8F6a5b3fC4c8F4788F0116861F9B"],
        topic0: [ProxyFactory111.events.ProxyCreation.topic],
    })
    .addLog({
        address: ["0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
        topic0: [ProxyFactory130.events.ProxyCreation.topic],
    })
    .addLog({
        topic0: [GnosisSafe.events.SignMsg.topic],
        transaction: true,
    });

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
export type Context = DataHandlerContext<Store, Fields>
