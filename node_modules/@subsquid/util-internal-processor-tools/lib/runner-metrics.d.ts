import { Range } from '@subsquid/util-internal-range';
export declare class RunnerMetrics {
    private requests;
    private chainHeight;
    private lastBlock;
    private mappingSpeed;
    private mappingItemSpeed;
    private blockProgress;
    constructor(requests: {
        range: Range;
    }[]);
    setChainHeight(height: number): void;
    setLastProcessedBlock(height: number): void;
    updateProgress(time?: bigint): void;
    registerBatch(batchSize: number, batchItemSize: number, batchMappingStartTime: bigint, batchMappingEndTime: bigint): void;
    private getRequestedBlockRanges;
    getEstimatedTotalBlocksCount(): number;
    getEstimatedBlocksLeft(): number;
    getChainHeight(): number;
    getLastProcessedBlock(): number;
    getSyncSpeed(): number;
    getSyncEtaSeconds(): number;
    getSyncRatio(): number;
    getMappingSpeed(): number;
    getMappingItemSpeed(): number;
    getStatusLine(): string;
}
//# sourceMappingURL=runner-metrics.d.ts.map