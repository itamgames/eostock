interface State {
    modalError: ModalError;
}

interface ModalError {
    error: string;
    detail: string;
}

export interface ErrorModalStore {
    state: State;
    actions: {
        setErrorModal({commit}: any, modalParam: ModalError): void,

    };
    getters: {
        errorModal(state: State): { error: string; detail: string; };
    };
    mutations: {
        setErrorModal(state: State, modalError: ModalError): void;
    };
}
