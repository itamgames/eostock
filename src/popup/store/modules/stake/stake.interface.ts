interface StakeParams {
    receiver: string;
    netQuantity: string;
    cpuQuantity: string;
    transfer: boolean;
}

export interface StakeStore {
    actions: {
        stake({commit, getters, dispatch}: any, stakeParams: StakeParams): void;
        unstake({commit, getters, dispatch}: any, unstakeParams: StakeParams): void;
        refund({dispatch, getters}: any): void;
    };
}
