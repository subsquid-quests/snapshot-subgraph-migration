import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Delegation} from './model'
import {Sig} from './model'
import * as DelegationABI from './abi/DelegateRegistry'
import * as SigProxy100ABI from './abi/GnosisSafeProxyFactory_v1.0.0'
import * as SigABI from './abi/GnosisSafe'
import * as SigProxy111ABI from './abi/GnosisSafeProxyFactory_v1.1.1'
import * as SigProxy130ABI from './abi/GnosisSafeProxyFactory_v1.3.0'
import {processor} from './processor'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    const delegations: Delegation[] = []
    for (let c of ctx.blocks) {
        for (let log of c.logs) {
            if(log.topics[0] === DelegationABI.events.SetDelegate.topic){
                let{ delegator, id, delegate } = DelegationABI.events.SetDelegate.decode(log)
                let idString = id.toString()
                let delegation = new Delegation({
                    delegator: delegator,
                    id: idString,
                    delegate: delegate,
                });
                delegations.push(delegation)
            }

            if(log.topics[0] === DelegationABI.events.ClearDelegate.topic){
                let { delegator, id, delegate } = DelegationABI.events.ClearDelegate.decode(log)
                let idString = id.toString()
                let delegation = new Delegation({
                    delegator: delegator,
                    id: idString,
                    delegate: delegate,
                });
                delegations.push(delegation)
            }
        }
    }

    const sigs: Sig[] = []
    for (let c of ctx.blocks) {
        for (let log of c.logs) {
            if(log.topics[0] === SigABI.events.AddedOwner.topic){
                let{ owner } = SigABI.events.AddedOwner.decode(log)
                let sig = new Sig({
                    owner: owner,
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.ApproveHash.topic){
                let { approvedHash, owner } = SigABI.events.ApproveHash.decode(log)
                let sig = new Sig({
                    approvedHash: approvedHash,
                    owner: owner,
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.ChangedFallbackHandler.topic){
                let { handler } = SigABI.events.ChangedFallbackHandler.decode(log)
                let sig = new Sig({
                    handler: handler,
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.ChangedGuard.topic){
                let { guard } = SigABI.events.ChangedGuard.decode(log)
                let sig = new Sig({
                    guard: guard,
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.ChangedThreshold.topic){
                let { threshold } = SigABI.events.ChangedThreshold.decode(log)
                let sig = new Sig({
                    threshold: threshold,
                });
                sigs.push(sig)
            }
            
            if(log.topics[0] ===  SigABI.events.DisabledModule.topic){
                let { module } = SigABI.events.DisabledModule.decode(log)
                let sig = new Sig({
                    module: module,
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.EnabledModule.topic){
                let { module } = SigABI.events.EnabledModule.decode(log)
                let sig = new Sig({
                    module: module,
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.ExecutionFailure.topic){
                let { txHash, payment } = SigABI.events.ExecutionFailure.decode(log)
                let sig = new Sig({
                    txHash: txHash,
                    payment: payment,
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.ExecutionFromModuleFailure.topic){
                let { module } = SigABI.events.ExecutionFromModuleFailure.decode(log)
                let sig = new Sig({
                    module: module,
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.ExecutionFromModuleSuccess.topic){
                let { module } = SigABI.events.ExecutionFromModuleSuccess.decode(log)
                let sig = new Sig({
                    module: module,
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.ExecutionSuccess.topic){
                let { txHash } = SigABI.events.ExecutionSuccess.decode(log)
                let sig = new Sig({
                    txHash: txHash,
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.RemovedOwner.topic){
                let { owner } = SigABI.events.RemovedOwner.decode(log)
                let sig = new Sig({
                    owner: owner,
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.SafeReceived.topic){
                let { sender, value } = SigABI.events.SafeReceived.decode(log)
                let sig = new Sig({
                    sender: sender,
                    value: value,
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.SafeSetup.topic){
                let { initiator, owners, threshold, initializer,  fallbackHandler } = SigABI.events.SafeSetup.decode(log)
                let sig = new Sig({
                    initiator: initiator,
                    owners: owners,
                    threshold: threshold,
                    initializer: initializer,      
                    fallbackHandler: fallbackHandler,             
                });
                sigs.push(sig)
            }

            if(log.topics[0] ===  SigABI.events.SignMsg.topic){
                let { msgHash } = SigABI.events.SignMsg.decode(log)
                let sig = new Sig({
                    msgHash: msgHash,
                });
                sigs.push(sig)
            }

            if(log.topics[0] === SigProxy100ABI.events.ProxyCreation.topic){
                let{ proxy } = SigProxy100ABI.events.ProxyCreation.decode(log)
                let sig = new Sig({
                    proxy: proxy,
                });
                sigs.push(sig)
            }

            if(log.topics[0] === SigProxy111ABI.events.ProxyCreation.topic){
                let{ proxy } = SigProxy111ABI.events.ProxyCreation.decode(log)
                let sig = new Sig({
                    proxy: proxy,
                });
                sigs.push(sig)
            }

            if(log.topics[0] === SigProxy130ABI.events.ProxyCreation.topic){
                let{ proxy } = SigProxy130ABI.events.ProxyCreation.decode(log)
                let sig = new Sig({
                    proxy: proxy,
                });
                sigs.push(sig)
            }
        }    
    }
    
    // upsert batches of entities with batch-optimized ctx.store.save
    await ctx.store.upsert(delegations)
})
