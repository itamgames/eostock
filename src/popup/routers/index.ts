import Vue from 'vue';
import Router from 'vue-router';
import sign from './sign/sign.router';
import fileImport from './file-import/file-import.router';
import home from './home/home.router';
import addAccount from './add-account/add-account.router';
import transfer from './transfer/transfer.router';
import setting from './setting/setting.router';
import connectionError from './connection-error/connection-error.router';
import delegate from './stake/stake.router';
import ram from './ram/ram.router';
import createAccount from './create-account/create-account.router';
import contract from './contract/contract.router';
import issueToken from './issue-token/issue-token.router';
import store from '../store/index';
import { ChromeStorageService } from '@/common/services/chrome-storage.service';
import { Account } from '@/popup/store/modules/account/account.interface';

Vue.use(Router);

const router: any = new Router({
    routes: [
        ...sign,
        ...fileImport,
        ...home,
        ...addAccount,
        ...transfer,
        ...setting,
        ...connectionError,
        ...delegate,
        ...ram,
        ...createAccount,
        ...contract,
        ...issueToken,
    ],
});

router.beforeEach(async (to: any, from: any, next: any) => {
    try {
        await checkAccount(to, from, next);
    } catch (e) {
        throw e;
    } finally {
        store.dispatch('unLoading');
    }
});

async function checkAccount(to: any, from: any, next: any) {
    const account = store.getters.account;

    if (from.name && to.name === 'home' && account.name) {
        store.dispatch('getAccountInfo', account);
        next();
    } else if (to.meta.notCheckAccount) {
        next();
    } else if (!account.name) {
        const accounts: any[] = store.getters.accounts;
        let selectedAccount = accounts[0];
        if (accounts.length > 1) {
            const accountName = await ChromeStorageService.get('selectedAccount');

            if (accountName) {
                selectedAccount = (accounts.filter((act: Account) => act.name === accountName))[0];
            }
        }

        store.dispatch('loading');
        await store.dispatch('getAccountInfo', selectedAccount || accounts[0]);
        store.dispatch('unLoading');
        next();
    } else {
        next();
    }
}

export default router;
