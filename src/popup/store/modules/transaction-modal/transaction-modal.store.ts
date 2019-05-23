import { TransactionModalStore } from './transaction-modal.interface';

const store: TransactionModalStore = {
    state: {
        transactionId: '',
    },
    actions: {
        openTransactionModal({commit}, transactionId) {
            commit('setTransactionId', transactionId);
        },
        closeTransactionModal({commit}) {
            commit('setTransactionId', '');
        },
    },
    getters: {
        transactionId: (state) => state.transactionId,
    },
    mutations: {
        setTransactionId(state, transactionId) {
            state.transactionId = transactionId;
        },
    },
};

export default store;
