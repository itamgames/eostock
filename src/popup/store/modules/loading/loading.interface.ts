interface LoadingState {
    loading: boolean;
}

export interface LoadingStore {
    state: LoadingState;
    actions: {
        loading({commit}: any): void;
        unLoading({commit}: any): void;
    };
    getters: {
        loading(state: LoadingState): boolean;
    };
    mutations: {
        loading(state: LoadingState): void;
        unLoading(state: LoadingState): void;
    };
}
