interface State {
    payload: any;
}

export interface WindowStore {
    state: State;
    actions: {
        setWindowPayload({commit}: any): void;
        response({commit}: any, payload: any): void;
        errorResponse({commit}: any, error: any): void;
    };
    getters: {
        requestPayload(state: State): any;
        pathName(state: State): string;
    };
    mutations: {
        setWindowPayload(state: State, payload: any): void,
    };
}
