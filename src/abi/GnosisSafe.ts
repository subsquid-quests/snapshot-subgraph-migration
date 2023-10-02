import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './GnosisSafe.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AddedOwner: new LogEvent<([owner: string] & {owner: string})>(
        abi, '0x9465fa0c962cc76958e6373a993326400c1c94f8be2fe3a952adfa7f60b2ea26'
    ),
    ApproveHash: new LogEvent<([approvedHash: string, owner: string] & {approvedHash: string, owner: string})>(
        abi, '0xf2a0eb156472d1440255b0d7c1e19cc07115d1051fe605b0dce69acfec884d9c'
    ),
    ChangedFallbackHandler: new LogEvent<([handler: string] & {handler: string})>(
        abi, '0x5ac6c46c93c8d0e53714ba3b53db3e7c046da994313d7ed0d192028bc7c228b0'
    ),
    ChangedGuard: new LogEvent<([guard: string] & {guard: string})>(
        abi, '0x1151116914515bc0891ff9047a6cb32cf902546f83066499bcf8ba33d2353fa2'
    ),
    ChangedThreshold: new LogEvent<([threshold: bigint] & {threshold: bigint})>(
        abi, '0x610f7ff2b304ae8903c3de74c60c6ab1f7d6226b3f52c5161905bb5ad4039c93'
    ),
    DisabledModule: new LogEvent<([module: string] & {module: string})>(
        abi, '0xaab4fa2b463f581b2b32cb3b7e3b704b9ce37cc209b5fb4d77e593ace4054276'
    ),
    EnabledModule: new LogEvent<([module: string] & {module: string})>(
        abi, '0xecdf3a3effea5783a3c4c2140e677577666428d44ed9d474a0b3a4c9943f8440'
    ),
    ExecutionFailure: new LogEvent<([txHash: string, payment: bigint] & {txHash: string, payment: bigint})>(
        abi, '0x23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23'
    ),
    ExecutionFromModuleFailure: new LogEvent<([module: string] & {module: string})>(
        abi, '0xacd2c8702804128fdb0db2bb49f6d127dd0181c13fd45dbfe16de0930e2bd375'
    ),
    ExecutionFromModuleSuccess: new LogEvent<([module: string] & {module: string})>(
        abi, '0x6895c13664aa4f67288b25d7a21d7aaa34916e355fb9b6fae0a139a9085becb8'
    ),
    ExecutionSuccess: new LogEvent<([txHash: string, payment: bigint] & {txHash: string, payment: bigint})>(
        abi, '0x442e715f626346e8c54381002da614f62bee8d27386535b2521ec8540898556e'
    ),
    RemovedOwner: new LogEvent<([owner: string] & {owner: string})>(
        abi, '0xf8d49fc529812e9a7c5c50e69c20f0dccc0db8fa95c98bc58cc9a4f1c1299eaf'
    ),
    SafeReceived: new LogEvent<([sender: string, value: bigint] & {sender: string, value: bigint})>(
        abi, '0x3d0ce9bfc3ed7d6862dbb28b2dea94561fe714a1b4d019aa8af39730d1ad7c3d'
    ),
    SafeSetup: new LogEvent<([initiator: string, owners: Array<string>, threshold: bigint, initializer: string, fallbackHandler: string] & {initiator: string, owners: Array<string>, threshold: bigint, initializer: string, fallbackHandler: string})>(
        abi, '0x141df868a6331af528e38c83b7aa03edc19be66e37ae67f9285bf4f8e3c6a1a8'
    ),
    SignMsg: new LogEvent<([msgHash: string] & {msgHash: string})>(
        abi, '0xe7f4675038f4f6034dfcbbb24c4dc08e4ebf10eb9d257d3d02c0f38d122ac6e4'
    ),
}

export const functions = {
    VERSION: new Func<[], {}, string>(
        abi, '0xffa1ad74'
    ),
    addOwnerWithThreshold: new Func<[owner: string, _threshold: bigint], {owner: string, _threshold: bigint}, []>(
        abi, '0x0d582f13'
    ),
    approveHash: new Func<[hashToApprove: string], {hashToApprove: string}, []>(
        abi, '0xd4d9bdcd'
    ),
    approvedHashes: new Func<[_: string, _: string], {}, bigint>(
        abi, '0x7d832974'
    ),
    changeThreshold: new Func<[_threshold: bigint], {_threshold: bigint}, []>(
        abi, '0x694e80c3'
    ),
    checkNSignatures: new Func<[dataHash: string, data: string, signatures: string, requiredSignatures: bigint], {dataHash: string, data: string, signatures: string, requiredSignatures: bigint}, []>(
        abi, '0x12fb68e0'
    ),
    checkSignatures: new Func<[dataHash: string, data: string, signatures: string], {dataHash: string, data: string, signatures: string}, []>(
        abi, '0x934f3a11'
    ),
    disableModule: new Func<[prevModule: string, module: string], {prevModule: string, module: string}, []>(
        abi, '0xe009cfde'
    ),
    domainSeparator: new Func<[], {}, string>(
        abi, '0xf698da25'
    ),
    enableModule: new Func<[module: string], {module: string}, []>(
        abi, '0x610b5925'
    ),
    encodeTransactionData: new Func<[to: string, value: bigint, data: string, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: string, refundReceiver: string, _nonce: bigint], {to: string, value: bigint, data: string, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: string, refundReceiver: string, _nonce: bigint}, string>(
        abi, '0xe86637db'
    ),
    execTransaction: new Func<[to: string, value: bigint, data: string, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: string, refundReceiver: string, signatures: string], {to: string, value: bigint, data: string, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: string, refundReceiver: string, signatures: string}, boolean>(
        abi, '0x6a761202'
    ),
    execTransactionFromModule: new Func<[to: string, value: bigint, data: string, operation: number], {to: string, value: bigint, data: string, operation: number}, boolean>(
        abi, '0x468721a7'
    ),
    execTransactionFromModuleReturnData: new Func<[to: string, value: bigint, data: string, operation: number], {to: string, value: bigint, data: string, operation: number}, ([success: boolean, returnData: string] & {success: boolean, returnData: string})>(
        abi, '0x5229073f'
    ),
    getChainId: new Func<[], {}, bigint>(
        abi, '0x3408e470'
    ),
    getModulesPaginated: new Func<[start: string, pageSize: bigint], {start: string, pageSize: bigint}, ([array: Array<string>, next: string] & {array: Array<string>, next: string})>(
        abi, '0xcc2f8452'
    ),
    getOwners: new Func<[], {}, Array<string>>(
        abi, '0xa0e67e2b'
    ),
    getStorageAt: new Func<[offset: bigint, length: bigint], {offset: bigint}, string>(
        abi, '0x5624b25b'
    ),
    getThreshold: new Func<[], {}, bigint>(
        abi, '0xe75235b8'
    ),
    getTransactionHash: new Func<[to: string, value: bigint, data: string, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: string, refundReceiver: string, _nonce: bigint], {to: string, value: bigint, data: string, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: string, refundReceiver: string, _nonce: bigint}, string>(
        abi, '0xd8d11f78'
    ),
    isModuleEnabled: new Func<[module: string], {module: string}, boolean>(
        abi, '0x2d9ad53d'
    ),
    isOwner: new Func<[owner: string], {owner: string}, boolean>(
        abi, '0x2f54bf6e'
    ),
    nonce: new Func<[], {}, bigint>(
        abi, '0xaffed0e0'
    ),
    removeOwner: new Func<[prevOwner: string, owner: string, _threshold: bigint], {prevOwner: string, owner: string, _threshold: bigint}, []>(
        abi, '0xf8dc5dd9'
    ),
    requiredTxGas: new Func<[to: string, value: bigint, data: string, operation: number], {to: string, value: bigint, data: string, operation: number}, bigint>(
        abi, '0xc4ca3a9c'
    ),
    setFallbackHandler: new Func<[handler: string], {handler: string}, []>(
        abi, '0xf08a0323'
    ),
    setGuard: new Func<[guard: string], {guard: string}, []>(
        abi, '0xe19a9dd9'
    ),
    setup: new Func<[_owners: Array<string>, _threshold: bigint, to: string, data: string, fallbackHandler: string, paymentToken: string, payment: bigint, paymentReceiver: string], {_owners: Array<string>, _threshold: bigint, to: string, data: string, fallbackHandler: string, paymentToken: string, payment: bigint, paymentReceiver: string}, []>(
        abi, '0xb63e800d'
    ),
    signedMessages: new Func<[_: string], {}, bigint>(
        abi, '0x5ae6bd37'
    ),
    simulateAndRevert: new Func<[targetContract: string, calldataPayload: string], {targetContract: string, calldataPayload: string}, []>(
        abi, '0xb4faba09'
    ),
    swapOwner: new Func<[prevOwner: string, oldOwner: string, newOwner: string], {prevOwner: string, oldOwner: string, newOwner: string}, []>(
        abi, '0xe318b52b'
    ),
}

export class Contract extends ContractBase {

    VERSION(): Promise<string> {
        return this.eth_call(functions.VERSION, [])
    }

    approvedHashes(arg0: string, arg1: string): Promise<bigint> {
        return this.eth_call(functions.approvedHashes, [arg0, arg1])
    }

    domainSeparator(): Promise<string> {
        return this.eth_call(functions.domainSeparator, [])
    }

    encodeTransactionData(to: string, value: bigint, data: string, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: string, refundReceiver: string, _nonce: bigint): Promise<string> {
        return this.eth_call(functions.encodeTransactionData, [to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce])
    }

    getChainId(): Promise<bigint> {
        return this.eth_call(functions.getChainId, [])
    }

    getModulesPaginated(start: string, pageSize: bigint): Promise<([array: Array<string>, next: string] & {array: Array<string>, next: string})> {
        return this.eth_call(functions.getModulesPaginated, [start, pageSize])
    }

    getOwners(): Promise<Array<string>> {
        return this.eth_call(functions.getOwners, [])
    }

    getStorageAt(offset: bigint, length: bigint): Promise<string> {
        return this.eth_call(functions.getStorageAt, [offset, length])
    }

    getThreshold(): Promise<bigint> {
        return this.eth_call(functions.getThreshold, [])
    }

    getTransactionHash(to: string, value: bigint, data: string, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: string, refundReceiver: string, _nonce: bigint): Promise<string> {
        return this.eth_call(functions.getTransactionHash, [to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce])
    }

    isModuleEnabled(module: string): Promise<boolean> {
        return this.eth_call(functions.isModuleEnabled, [module])
    }

    isOwner(owner: string): Promise<boolean> {
        return this.eth_call(functions.isOwner, [owner])
    }

    nonce(): Promise<bigint> {
        return this.eth_call(functions.nonce, [])
    }

    signedMessages(arg0: string): Promise<bigint> {
        return this.eth_call(functions.signedMessages, [arg0])
    }
}
