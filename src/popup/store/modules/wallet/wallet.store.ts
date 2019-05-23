import { decrypt, encrypt } from '../../../../common/utils/crypto.utils';
import { chromeRuntimeSend } from '../../../../common/services/chrome-runtime.service';
import { ChromeStorageService } from '@/common/services/chrome-storage.service';
import { EosService } from '../../../../common/services/eos.service';
import { Account } from '../account/account.interface';
import { WalletStore } from '@/popup/store/modules/wallet/wallet.interface';
import { SUPPORT_NETWORK, BEFORE_NETWORK } from '@/common/config';

async function _addSsoToken(wallet: any, password: string) {
    // account에 token을 추가 한다.
    let isSaveWallet = false;
    for (const account of wallet.accounts) {
        if (!account.ssoToken || account.ssoToken.indexOf('SIG_') !== 0) {
            isSaveWallet = true;
            const privateKey = decrypt(account.privateKey, password);
            account.ssoToken = EosService.Instance.sign(account.name, privateKey);
        }
        const networkName = account.network.name;
        if (networkName && BEFORE_NETWORK[networkName]) {
            account.network = BEFORE_NETWORK[networkName];
            isSaveWallet = true;
        } else if (!BEFORE_NETWORK[networkName] && !account.network.symbol) {
            account.network.symbol = 'EOS';
            isSaveWallet = true;
        } else if (!networkName) {
            account.network = BEFORE_NETWORK.mainNet;
            isSaveWallet = true;
        }
    }

    if (isSaveWallet) {
        await ChromeStorageService.set('wallet', encrypt(wallet, password));
    }

    return wallet;
}

/**
 * active key인지 체크한다.
 *
 * @param privateKey
 * @param accountName
 */
async function _checkActiveKey(privateKey: string, name: string) {
    const eos = EosService.Instance;
    const publicKey = eos.getPublicKey(privateKey);
    const accountInfo = await eos.getAccountInfo(name);
    const activeKey = accountInfo.permissions
        .filter((account: any) => account.perm_name === 'active')[0]
        .required_auth.keys[0].key;

    if (publicKey !== activeKey) {
        throw new Error('notActiveKey');
    }
}

const store: WalletStore = {
    state: {
        wallet: {
            create: null,
            accounts: [],
        },
        networks: {},
        isLock: true,
        accountsByKey: {},
        encryptWallet: '',
    },
    actions: {
        /**
         * 지갑을 만든다.
         *
         * @param {any} commit
         * @param {any} dispatch
         * @param {string} password
         * @param {Account} account
         * @returns {void}
         */
        async createWallet({commit, dispatch}, {account, password}) {
            dispatch('loading');
            try {
                const {privateKey, name} = account;

                EosService.Instance.setEos(account.network.name);
                await _checkActiveKey(privateKey, name);

                // token 저장
                account.ssoToken = EosService.Instance.sign(name, privateKey);
                // privateKey 암호화
                account.privateKey = encrypt(privateKey, password);
                // wallet 초기 셋팅
                const wallet = {
                    create: Date.now(),
                    accounts: [account],
                };

                // 월렛 자체 암호화
                const encryptWallet = encrypt(wallet, password);

                await ChromeStorageService.set('wallet', encryptWallet);

                // 지갑 저장, lock 풀기
                await dispatch('unlockWallet', {password, wallet, encryptWallet});
            } catch (e) {
                throw e;
            } finally {
                dispatch('unLoading');
            }

        },
        /**
         * 지갑 로그인
         *
         * @param {any} commit
         * @param {any} dispatch
         * @param {string} password
         * @returns {void}
         */
        async signInWallet({commit, dispatch, getters}, password) {
            // 월렛 가져오기
            let encryptWallet = await ChromeStorageService.get('wallet');
            if (!encryptWallet) {
                throw new Error(`wallet`);
            }

            try {
                // 월렛 복호화
                const wallet: any = decrypt(encryptWallet, password);

                // TODO 과거 컴버젼떄문에 쓰임
                const newWallet = await _addSsoToken(wallet, password);

                encryptWallet = encrypt(newWallet, password);

                // 지갑 저장, lock 풀기
                await dispatch('unlockWallet', {password, wallet: newWallet, encryptWallet});
                await dispatch('initAutoLock');
            } catch (e) {
                throw new Error('password');
            }
        },
        /**
         * 지갑 저장 밑 unlock
         *
         * @param {any} commit
         * @param {string} password
         * @param {Wallet} wallet
         * @returns {void}
         */
        async unlockWallet({commit, dispatch}, {password, wallet, encryptWallet}) {
            await chromeRuntimeSend('unlock', password);
            commit('setEncryptWallet', encryptWallet);
            commit('isLock', false);
            commit('setWallet', wallet);
        },
        /**
         * 지갑 가져오기
         *
         * @param {any} commit
         * @returns {void}
         */
        async loadWallet({commit, dispatch}) {
            let encryptWallet = await ChromeStorageService.get('wallet');

            if (!encryptWallet) {
                return;
            }
            commit('setEncryptWallet', encryptWallet);

            const password: any = await chromeRuntimeSend('get');
            if (!password) {
                commit('isLock', true);
                return;
            }

            try {
                const wallet: any = decrypt(encryptWallet, password);

                // TODO 과거 컴버젼떄문에 쓰임
                const newWallet = await _addSsoToken(wallet, password);

                encryptWallet = encrypt(newWallet, password);
                commit('setEncryptWallet', encryptWallet);
                commit('setWallet', newWallet);
                commit('isLock', false);
                await dispatch('initAutoLock');
            } catch (e) {
                await chromeRuntimeSend('setPassword', '');
                commit('setWallet', null);
            }
        },
        /**
         * 지갑에 락을 건다.
         *
         * @param {any} commit
         * @returns {void}
         */
        async lock({dispatch}) {
            dispatch('clearAccountStore');
            dispatch('clearWalletAll');
            dispatch('settingClear');
            await chromeRuntimeSend('lock');
        },
        /**
         * 지갑에 account를 추가한다.
         *
         * @param {any} commit
         * @param {any} state
         * @param {Account} account
         * @returns {void}
         */
        async addAccountToWallet({commit, state, dispatch}, account) {
            dispatch('loading');
            try {
                const privateKey = account.privateKey;
                const accountName = account.name;

                await _checkActiveKey(privateKey, account.name);

                const wallet = state.wallet;
                const walletAccounts = state.wallet.accounts;
                for (const walletAccount of walletAccounts) {
                    if (walletAccount.name === account.name && walletAccount.network.name === account.network.name) {
                        return;
                    }
                }
                const password: any = await chromeRuntimeSend('get');

                account.token = EosService.Instance.sign(accountName, privateKey);
                account.ssoToken = encrypt(account.name, privateKey);
                account.privateKey = encrypt(privateKey, password);
                wallet.accounts.push(account);

                await ChromeStorageService.set('wallet', encrypt(wallet, password));

                commit('setWallet', wallet);
            } catch (e) {
                throw e;
            } finally {
                dispatch('unLoading');
            }
        },
        /**
         * private key를 가지고 월렛어 등록 가능한 accounts를 가지고 온다.
         *
         * @param {any} commit
         * @param {any} dispatch
         * @param {any} getters
         * @param {string} privateKey
         * @param {Network} network
         * @returns {void}
         */
        async getAccountsByKey({commit, dispatch, getters}, {privateKey, network}) {
            dispatch('loading');
            try {
                const eos = EosService.Instance;
                eos.setEos(network);
                const accountsByKey = await eos.getKeyAccounts(privateKey);
                const walletAccounts: Account[] = getters.accounts;
                const accounts: any = {};

                for (const name of accountsByKey) {
                    let pass = false;
                    for (const walletAccount of walletAccounts) {
                        if (name === walletAccount.name && network.name === walletAccount.network.name) {
                            pass = true;
                            break;
                        }
                    }
                    if (!pass) {
                        accounts[name] = {name, network, privateKey};
                    }
                }
                commit('setAccountsByKey', accounts);
            } catch (e) {
                throw new Error('잘못된 private key 입니다.');
            } finally {
                dispatch('unLoading');
            }
        },
        /**
         * clear accountsByKey
         *
         * @param {any} commit
         */
        clearAccountsByKey({commit}) {
            commit('setAccountsByKey', []);
        },
        async removeAccount({commit, state, dispatch}, account) {
            const accounts = [...state.wallet.accounts];
            const wallet = {...state.wallet};
            wallet.accounts = accounts
                .filter((walletAccount: Account) =>
                    !(walletAccount.name === account.name && walletAccount.network.name === account.network.name));

            const password: any = await chromeRuntimeSend('get');

            // 월렛 자체 암호화
            const encryptWallet = encrypt(wallet, password);
            // 월렛 스토리지 저장
            await ChromeStorageService.set('wallet', encryptWallet);
            // 지갑 저장, lock 풀기
            await dispatch('unlockWallet', {password, wallet, encryptWallet});
        },
        /**
         * 지갑을 임포트 한다.
         *
         * @param {any} commit
         * @param {string} password
         * @param {string} encryptWallet
         * @returns {void}
         */
        async importWallet({commit, dispatch}, {password, encryptWallet}) {
            const wallet: any = decrypt(encryptWallet, password);

            // TODO 과거 컴버젼떄문에 쓰임
            const newWallet = await _addSsoToken(wallet, password);

            const newEncryptWallet = encrypt(newWallet, password);
            await ChromeStorageService.set('wallet', newEncryptWallet);

            await dispatch('unlockWallet', {password, wallet, newEncryptWallet});
        },
        /**
         * wallet을 초기화 한다.
         *
         * @param commit
         */
        clearWalletAll({commit}) {
            commit('clearWalletAll');
        },
        async initNetworks({commit}) {
            const savedNetworks = (await ChromeStorageService.get('networks')) || {};

            // SUPPORT_NETWORK가 변경되는거 막기 위해 {}을 씀
            const networks = Object.assign({...SUPPORT_NETWORK}, savedNetworks);

            commit('setNetworks', networks);
        },
        async addCustomNetwork({commit, getters}, network) {
            const networks = Object.assign(getters.networks, {[network.name]: network});
            await ChromeStorageService.set('networks', networks);
            commit('setNetworks', networks);
        },
        async deleteCustomNetwork({commit, getters}, networkName) {
            const networks = {...getters.networks};
            delete networks[networkName];
            await ChromeStorageService.set('networks', networks);
            commit('setNetworks', networks);
        },
    },
    getters: {
        walletIsLock: (state) => state.isLock,
        accounts: (state) => state.wallet.accounts,
        accountsByKey: (state) => state.accountsByKey,
        encryptWallet: (state) => state.encryptWallet,
        wallet: (state) => state.wallet,
        networks: (state) => state.networks,
    },
    mutations: {
        setWallet(state, wallet) {
            state.wallet = {...wallet};
        },
        isLock(state, isLock) {
            state.isLock = isLock;
        },
        setAccountsByKey(state, accounts) {
            state.accountsByKey = accounts;
        },
        setEncryptWallet(state, encryptWallet) {
            state.encryptWallet = encryptWallet;
        },
        clearWalletAll(state) {
            state.wallet = {
                create: null,
                accounts: [],
            };

            state.isLock = true;
            state.accountsByKey = {};
            state.encryptWallet = '';
            state.networks = {};
        },
        setNetworks(state, networks) {
            state.networks = networks;
        },
    },
};


export default store;
