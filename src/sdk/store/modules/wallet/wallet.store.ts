import { decrypt } from '@/common/utils/crypto.utils';
import { chromeRuntimeSend } from '@/common/services/chrome-runtime.service';
import { ChromeStorageService } from '@/common/services/chrome-storage.service';
import { WalletStore } from './wallet.interface';
import { ErrorModule } from '@/common/error';
import router from '@/sdk/routers';

const store: WalletStore = {
    state: {
        wallet: {
            create: null,
            accounts: [],
        },
        isLock: true,
        autoLock: {
            enable: false,
            immediate: 0,
        },
        hasWallet: false,
        account: {},
    },
    actions: {
        /**
         * 지갑 로그인
         *
         * @param {any} commit
         * @param {any} dispatch
         * @param {string} password
         * @returns {void}
         */
        async signInWallet({commit, dispatch}, password) {
            // 월렛 가져오기
            const encryptWallet = await ChromeStorageService.get('wallet');
            if (!encryptWallet) {
                throw new Error(`wallet`);
            }

            try {
                // 월렛 복호화
                const wallet: any = decrypt(encryptWallet, password);
                // 지갑 저장, lock 풀기
                await chromeRuntimeSend('unlock', password);
                commit('isLock', false);
                commit('setWallet', wallet);
                await dispatch('initAutoLock');
            } catch (e) {
                throw new Error('password');
            }
        },
        /**
         * 지갑 가져오기
         *
         * @param {any} commit
         * @returns {void}
         */
        async loadWallet({commit, dispatch}) {
            const encryptWallet = await ChromeStorageService.get('wallet');

            if (!encryptWallet) {
                return;
            }

            // 월렛이 있다고 표시
            commit('hasWallet', true);

            const password: any = await chromeRuntimeSend('get');
            if (!password) {
                commit('isLock', true);
                return;
            }

            try {
                const wallet: any = decrypt(encryptWallet, password);
                commit('setWallet', wallet);
                commit('isLock', false);
                await dispatch('initAutoLock');
            } catch (e) {
                await chromeRuntimeSend('setPassword', '');
                commit('setWallet', null);
            }
        },
        /**
         * AutoLock 체크하여 구동한다.
         *
         * @param commit
         * @param getters
         * @param state
         * @param immediate
         */
        checkAutoLock({commit, getters, state}) {
            if (state.autoLock.enable) {
                chromeRuntimeSend('autoLock', state.autoLock).then((isLock: any) => {
                    if (isLock) {
                        commit('clearWalletAll');
                    }
                    commit('isLock', isLock);
                });
            }
        },
        /**
         * autoLock Init
         *
         * @param commit
         * @param dispatch
         */
        async initAutoLock({commit, dispatch, state}) {
            const autoLock = await ChromeStorageService.get('autoLock') || state.autoLock;
            commit('setAutoLock', autoLock);
            dispatch('checkAutoLock');
        },
        /**
         * ssoToken을 가지고 현재 account를 가지고 온다.
         *
         * @param commit
         * @param getters
         */
        async getAccount({commit, getters}, host) {
            const accounts = getters.accounts;
            const ssoToken = (await ChromeStorageService.get(host)).ssoToken;

            if (!ssoToken) {
                throw ErrorModule.checkToken();
            }

            let account;
            for (const walletAccount of accounts) {
                if (walletAccount.ssoToken === ssoToken) {
                    account = walletAccount;
                    break;
                }
            }

            if (!account) {
                throw ErrorModule.checkToken();
            }

            const password: any = await chromeRuntimeSend('get');
            if (!password) {
                router.push('/sign-in');
                return;
            }

            commit('setAccount', account);

        },

    },
    getters: {
        walletIsLock: (state) => state.isLock,
        accounts: (state) => state.wallet.accounts,
        hasWallet: (state) => state.hasWallet,
        account: (state) => state.account,
    },
    mutations: {
        setWallet(state, wallet) {
            state.wallet = {...wallet};
        },
        isLock(state, isLock) {
            state.isLock = isLock;
        },
        clearWalletAll(state) {
            state = {
                wallet: {
                    create: null,
                    accounts: [],
                },
                isLock: true,
                autoLock: {
                    enable: false,
                    immediate: 0,
                },
                hasWallet: false,
                account: {},
            };
        },
        setAutoLock(state, autoLock) {
            state.autoLock = {...autoLock};
        },
        hasWallet(state, hasWallet) {
            state.hasWallet = hasWallet;
        },
        setAccount(state, account) {
            state.account = account;
        },
    },
};


export default store;
