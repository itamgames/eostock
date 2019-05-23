import Vue from 'vue';
import Vuex from 'vuex';
import wallet from './modules/wallet/wallet.store';
import loading from './modules/loading/loading.store';
import window from './modules/window/window.store';
import prompt from './modules/prompt/prompt.store';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        wallet,
        loading,
        window,
        prompt,
    },
});
