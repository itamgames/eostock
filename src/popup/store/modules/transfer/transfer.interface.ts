interface TransferState {
    possibleBalance: number;
    balanceLoading: boolean;
}

interface TransferParams {
    to: string;
    quantity: number;
    memo: string;
    contractName: string;
    symbol: string;
}

interface PossibleBalanceParams {
    contractName: string;
    symbol: string;
}

export interface TransferStore {
    state: TransferState;
    actions: {
        getPossibleBalance({commit, getters}: any, possibleBalanceParams: PossibleBalanceParams): void;
        transfer({commit, getters, dispatch}: any, transferParams: TransferParams): void;
    };
    getters: {
        possibleBalance(state: TransferState): number;
        balanceLoading(state: TransferState): boolean;
    };
    mutations: {
        setPossibleBalance(state: TransferState, balance: number): void;
        balanceLoading(state: TransferState, balanceLoading: boolean): void;
    };
}
