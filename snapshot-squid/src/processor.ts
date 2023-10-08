import { lookupArchive } from '@subsquid/archive-registry'
import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor'
import { events as GnosisSafeEvent } from './abi/GnosisSafe'
import { events as DelegateRegistryEvent } from './abi/DelegateRegistry'
import { events as GnosisSafeProxyFactory_v130Event } from './abi/GnosisSafeProxyFactory_v1.3.0'
import { events as GnosisSafeProxyFactory_v111Event } from './abi/GnosisSafeProxyFactory_v1.1.1'
import { events as GnosisSafeProxyFactory_v100Event } from './abi/GnosisSafeProxyFactory_v1.0.0'

export const DELEGATE_CONTRACT = '0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446'.toLowerCase();

export const GNOSIS_SAFE_V1_3_0_CONTRACT = '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2'.toLowerCase();

export const GNOSIS_SAFE_V1_1_1_CONTRACT = '0x76E2cFc1F5Fa8F6a5b3fC4c8F4788F0116861F9B'.toLowerCase();

export const GNOSIS_SAFE_V1_0_0_CONTRACT = '0x12302fE9c02ff50939BaAaaf415fc226C078613C'.toLowerCase();

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
        from: 11_225_320,
    })
    .addLog({
        address: [DELEGATE_CONTRACT],
        topic0: [
            DelegateRegistryEvent.SetDelegate.topic,
            DelegateRegistryEvent.ClearDelegate.topic
        ]
    })
    .addLog({
        address: [GNOSIS_SAFE_V1_0_0_CONTRACT, GNOSIS_SAFE_V1_1_1_CONTRACT, GNOSIS_SAFE_V1_3_0_CONTRACT],
        topic0: [GnosisSafeEvent.SignMsg.topic],
    })
    .addLog({
        address: [GNOSIS_SAFE_V1_3_0_CONTRACT],
        topic0: [GnosisSafeProxyFactory_v130Event.ProxyCreation.topic]
    })
    .addLog({
        address: [GNOSIS_SAFE_V1_1_1_CONTRACT],
        topic0: [GnosisSafeProxyFactory_v111Event.ProxyCreation.topic]
    })
    .addLog({
        address: [GNOSIS_SAFE_V1_0_0_CONTRACT],
        topic0: [GnosisSafeProxyFactory_v100Event.ProxyCreation.topic]
    })

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
