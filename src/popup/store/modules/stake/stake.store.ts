import { StakeStore } from '@/popup/store/modules/stake/stake.interface';
import { EosService } from '@/common/services/eos.service';

const store: StakeStore = {
    actions: {
        async stake({commit, getters, dispatch}, {receiver, cpuQuantity, netQuantity, transfer}) {
            dispatch('loading');
            try {
                const mainSymbol = getters.account.mainSymbol;
                const from = getters.nowAccountName;
                // 나의 계정에게 stake 할때는 무조건 transfer는 false이다.
                if (from === receiver) {
                    transfer = false;
                }
                const result: any =
                    await EosService.Instance.delegate(
                        from, receiver, Number(cpuQuantity), Number(netQuantity), transfer, mainSymbol,
                    );
                dispatch('openTransactionModal', result.transaction_id);
            } finally {
                dispatch('unLoading');
            }
        },
        async unstake({commit, getters, dispatch}, {receiver, cpuQuantity, netQuantity}) {
            dispatch('loading');
            try {
                const mainSymbol = getters.account.mainSymbol;
                const from = getters.nowAccountName;
                const result: any =
                    await EosService.Instance.undelegate(
                        from, receiver, Number(cpuQuantity), Number(netQuantity), mainSymbol,
                    );
                dispatch('openTransactionModal', result.transaction_id);
            } finally {
                dispatch('unLoading');
            }
        },
        async refund({dispatch, getters}) {
            dispatch('loading');
            try {
                const owner = getters.nowAccountName;
                const result: any = await EosService.Instance.refund(owner);
                dispatch('openTransactionModal', result.transaction_id);
            } finally {
                dispatch('unLoading');
            }

        },
    },
};

export default store;
