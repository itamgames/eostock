import Vue from 'vue';
import App from './App.vue';
import { i18n, settingLocale } from '@/common/i18n';
import '../common/filters/utils.filter';
import store from './store';
import router from './routers';
import '../common/styles/index-sdk.scss';
import { ErrorModule } from '@/common/error';

Vue.config.productionTip = false;

const loadWallet = async () => {
    await store.dispatch('loadWallet');

    if (store.getters.hasWallet && store.getters.walletIsLock) {
        router.push('/sign-in');
        return;
    }

    router.push({name: store.getters.pathName});
};

const main = async () => {
    store.dispatch('setWindowPayload', (window as any).data.payload);
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
