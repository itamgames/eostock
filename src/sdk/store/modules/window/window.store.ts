import { WindowStore } from './window.interface';

const request = (window as any).data;

const store: WindowStore = {
    state: {
        payload: {},
    },
    actions: {
        setWindowPayload({commit}) {
            commit('setWindowPayload', request.payload);
        },
        response({}, payload) {
            request.res(null, payload);
            self.close();
        },
        errorResponse({}, error) {
            request.res(error);
            self.close();
        },
    },
    getters: {
        requestPayload: (state) => state.payload,
        pathName: (state) => state.payload.type,
    },
    mutations: {
        setWindowPayload(state, payload) {
            state.payload = payload;
        },
    },
};


export default store;
