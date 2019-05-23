import { ErrorModalStore } from './error-modal.interface';

const store: ErrorModalStore = {
    state: {
        modalError: {
            error: '',
            detail: '',
        },
    },
    actions: {
        setErrorModal({commit}, modalError) {
            commit('setErrorModal', modalError);
        },
    },
    getters: {
        errorModal: (state) => state.modalError,
    },
    mutations: {
        setErrorModal(state, modalError) {
            state.modalError = {...modalError};
        },
    },
};

export default store;
