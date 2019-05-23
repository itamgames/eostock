import { EosService } from '../../../../common/services/eos.service';
import { TransferStore } from '@/popup/store/modules/transfer/transfer.interface';

const store: TransferStore = {
    state: {
        possibleBalance: 0,
        balanceLoading: false,
    },
    actions: {
        async getPossibleBalance({commit, getters}, {contractName, symbol}) {
            commit('balanceLoading', true);
            try {
                const accountName = getters.nowAccountName;
                const balance: string =
                    (await EosService.Instance.getCurrencyBalance(accountName, contractName, symbol))[0];
                if (!balance) {
                    commit('setPossibleBalance', 0);
                } else {
                    commit('setPossibleBalance', Number(balance.split(' ')[0]));
                }
            } catch (e) {
                commit('setPossibleBalance', 0);
            } finally {
                commit('balanceLoading', false);
            }
        },
        async transfer({commit, getters, dispatch}, {to, quantity, memo, contractName, symbol}) {
            dispatch('loading');
            try {
                const from = getters.nowAccountName;
                const result: any =
                    await EosService.Instance.transfer(from, to, Number(quantity), memo, contractName, symbol);
                dispatch('openTransactionModal', result.transaction_id);
            } finally {
                dispatch('unLoading');
            }
        },
    },
    getters: {
        possibleBalance: (state) => state.possibleBalance,
        balanceLoading: (state) => state.balanceLoading,
    },
    mutations: {
        setPossibleBalance(state, balance) {
            state.possibleBalance = balance;
        },
        balanceLoading(state, balanceLoading) {
            state.balanceLoading = balanceLoading;
        },
    },
};

export default store;
