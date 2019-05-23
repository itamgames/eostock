import { decrypt, encrypt } from '../../../../common/utils/crypto.utils';
import { chromeRuntimeSend } from '../../../../common/services/chrome-runtime.service';
import { SettingStore } from './setting.interface';
import { ChromeStorageService } from '@/common/services/chrome-storage.service';
import { Wallet } from '../wallet/wallet.interface';
import { i18n } from '../../../../common/i18n/index';

const store: SettingStore = {
    state: {
        autoLock: {
            enable: false,
            immediate: 0,
        },
        language: '',
    },
    actions: {
        /**
         * 비밀번호 확인
         *
         * @param oldPassword
         */
        async checkPassword({}, oldPassword) {
            const password: any = (await chromeRuntimeSend('get')).toString();
            if (password !== oldPassword) {
                throw new Error('wrong_password');
            }
        },
        /**
         * password를 변경한다.
         *
         * @param {any} commit
         * @param {string} password
         * @param {string} newPassword
         * @returns {void}
         */
        async changePassword({commit, getters}, {oldPassword, newPassword}) {
            const password: any = (await chromeRuntimeSend('get')).toString();
            if (password !== oldPassword) {
                throw new Error('wrong_password');
            }
            const wallet: Wallet = {...getters.wallet};
            for (const account of wallet.accounts) {
                const privateKey = decrypt(account.privateKey, oldPassword);
                account.privateKey = encrypt(privateKey, newPassword);
            }
            // 월렛 자체 암호화
            const encryptWallet = encrypt(wallet, newPassword);
            // 월렛 스토리지 저장
            await ChromeStorageService.set('wallet', encryptWallet);

            await chromeRuntimeSend('unlock', newPassword);
        },
        /**
         * AutoLock 체크하여 구동한다.
         *
         * @param commit
         * @param getters
         * @param state
         * @param immediate
         */
        checkAutoLock({commit, getters, state, dispatch}) {
            if (state.autoLock.enable) {
                chromeRuntimeSend('autoLock', state.autoLock).then((isLock: any) => {
                    if (isLock) {
                        dispatch('clearWalletAll');
                        dispatch('clearAccountStore');
                    }
                    commit('isLock', isLock);
                });
            }
        },
        /**
         * autoLock에 대해 설정한다.
         *
         * @param commit
         * @param dispatch
         * @param immediate
         */
        async setAutoLock({commit, dispatch}, immediate) {
            const autoLock = {enable: !!immediate, immediate};
            await ChromeStorageService.set('autoLock', autoLock);
            commit('setAutoLock', {enable: !!immediate, immediate});
            dispatch('checkAutoLock');
        },
        /**
         * autoLock Init
         *
         * @param commit
         * @param dispatch
         */
        async initAutoLock({commit, dispatch, getters}) {
            const autoLock = await ChromeStorageService.get('autoLock') || getters.autoLock;
            commit('setAutoLock', autoLock);
            dispatch('checkAutoLock');
        },
        /**
         * 언어 설정
         *
         * @param commit
         * @param language
         */
        async setLanguage({commit}, language) {
            i18n.locale = language;
            commit('setLanguage', language);
            await ChromeStorageService.set('locale', i18n.locale);
        },
        /**
         * 초기화 한다.
         *
         * @param dispatch
         */
        async reset({dispatch}) {
            await ChromeStorageService.clear();
            await dispatch('clearAccountStore');
            await dispatch('clearWalletAll');
            await dispatch('settingClear');
            await dispatch('initNetworks');
        },
        /**
         * setting 초기화.
         *
         * @param dispatch
         */
        async settingClear({commit}) {
            commit('settingClear');
        },
    },
    getters: {
        autoLock: (state) => state.autoLock,
        language: (state) => state.language,
    },
    mutations: {
        setAutoLock(state, autoLock) {
            state.autoLock = {...autoLock};
        },
        setLanguage(state, language) {
            state.language = language;
        },
        settingClear(state) {
            state = {
                autoLock: {
                    enable: false,
                    immediate: 0,
                },
                language: '',
            };
        },
    },
};

export default store;
