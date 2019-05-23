import { LoadingStore } from './loading.interface';

const store: LoadingStore = {
    state: {
        loading: false,
    },
    actions: {
        loading({commit}) {
            commit('loading');
        },
        unLoading({commit}) {
            commit('unLoading');
        },
    },
    getters: {
        loading: (state) => state.loading,
    },
    mutations: {
        loading(state) {
            state.loading = true;
        },
        unLoading(state) {
            state.loading = false;
        },
    },
};

export default store;
