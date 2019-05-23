import Vue from 'vue';
import App from './App.vue';
import router from './routers/index';
import store from './store/index';
import { i18n, settingLocale } from '../common/i18n/index';

import '../common/styles/index-popup.scss';
import '../common/filters/utils.filter';
import '../common/directive/key.directive';

Vue.config.productionTip = false;

const loadWallet = async () => {
    store.dispatch('initNetworks');
    await store.dispatch('loadWallet');
    const encryptWallet = store.getters.encryptWallet;
    if (encryptWallet) {
        if (store.getters.walletIsLock) {
            router.push('/sign/in');
        }
    } else {
        router.push('/sign/up');
    }
};

// vue를 구동하기 전에 locale을 가지고 와서 셋팅해준다.
const main = async () => {
    await settingLocale();
    await loadWallet();

    new Vue({
        router,
        store,
        i18n,
        render: (h) => h(App),
    }).$mount('#app');
};

main();

