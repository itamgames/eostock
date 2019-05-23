interface RamParams {
    receiver: string;
    quantity: number;
}

export interface RamStore {
    actions: {
        buyRam({commit, getters, dispatch}: any, ramParams: RamParams): void;
        buyRamBytes({commit, getters, dispatch}: any, ramParams: RamParams): void;
        sellRam({commit, getters, dispatch}: any, ramParams: RamParams): void;
    };
}
