import { EosService } from '@/common/services/eos.service';
import { RamStore } from './ram.interface';

const store: RamStore = {
    actions: {
        async buyRam({commit, getters, dispatch}, {receiver, quantity}) {
            dispatch('loading');
            try {
                const mainSymbol = getters.account.mainSymbol;
                const result =
                    await EosService.Instance.buyRam(getters.nowAccountName, receiver, Number(quantity), mainSymbol);
                await  dispatch('getAccountInfo', getters.account);
                dispatch('openTransactionModal', result.transaction_id);
            } finally {
                dispatch('unLoading');
            }
        },
        async buyRamBytes({commit, getters, dispatch}, {receiver, quantity}) {
            dispatch('loading');
            try {
                const result =
                    await EosService.Instance.buyRamBytes(getters.nowAccountName, receiver, Number(quantity));
                await dispatch('getAccountInfo', getters.account);
                dispatch('openTransactionModal', result.transaction_id);
            } finally {
                dispatch('unLoading');
            }
        },
        async sellRam({commit, getters, dispatch}, {quantity}) {
            dispatch('loading');
            try {
                const payer = getters.nowAccountName;
                const result: any = await EosService.Instance.sellRam(payer, Number(quantity));
                await dispatch('getAccountInfo', getters.account);
                dispatch('openTransactionModal', result.transaction_id);
            } finally {
                dispatch('unLoading');
            }
        },
    },
};

export default store;
