interface State {
    contract: any;
    burnSymbols: any[];
    actions: any[];
}

export interface ContractStore {
    state: State;
    actions: {
        getContract({commit, getters}: any): void;
        getMyContractToken({getters}: any, params: {symbol: string}): Promise<any>;
        deployContract({commit, getters}: any, params: {wasmFile: any, abiFile: any}): void;
        issueToken({commit, getters}: any, params: {symbol: string, maxSupply: number,
            to: string, quantity: number, memo: string}): void;
        burn({commit, getters}: any, params: {symbol: string, quantity: number}): void;
        runAction({commit, getters}: any, params: {action: string, data: any}): void;
    };
    getters: {
        hasBurn(state: State): boolean;
        burnSymbols(state: State): any[];
        actions(state: State): any;
    };
    mutations: {
        contract(state: State, contract: any): void;
        burnSymbols(state: State, symbols: any[]): void;
        actions(state: State, actions: any[]): void;
    };
}
