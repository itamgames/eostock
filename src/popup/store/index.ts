import Vue from 'vue';
import Vuex from 'vuex';
import wallet from './modules/wallet/wallet.store';
import account from './modules/account/account.store';
import layout from './modules/loading/loading.store';
import transfer from './modules/transfer/transfer.store';
import setting from './modules/setting/setting.store';
import stake from './modules/stake/stake.store';
import ram from './modules/ram/ram.store';
import errorModal from './modules/error-modal/error-modal.store';
import transactionModal from './modules/transaction-modal/transaction-modal.store';
import deployContract from './modules/contract/contract.store';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        wallet,
        account,
        layout,
        transfer,
        setting,
        stake,
        ram,
        errorModal,
        transactionModal,
        deployContract,
    },
});
