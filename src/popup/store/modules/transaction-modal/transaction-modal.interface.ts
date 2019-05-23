interface State {
    transactionId: string;
}

export interface TransactionModalStore {
    state: State;
    actions: {
        openTransactionModal({commit}: any, transactionId: string): void,
        closeTransactionModal({commit}: any): void,
    };
    getters: {
        transactionId(state: State): string;
    };
    mutations: {
        setTransactionId(state: State, transactionId: string): void;
    };
}
