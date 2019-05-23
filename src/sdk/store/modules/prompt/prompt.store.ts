import { PromptStore, Prompt } from './prompt.interface';

const store: PromptStore = {
    state: {
        actions: [],
    },
    actions: {
        initPrompt({commit}, args) {
            const actions: Prompt[] = args.map((action: any) => {
                const result: any = {};
                result.contract = action.account;
                result.action = action.name;
                result.data = action.data;
                return result;
            });
            commit('setActions', actions);
        },
    },
    getters: {
        actions: (state) => state.actions,
    },
    mutations: {
        setActions(state, actions) {
            state.actions = actions;
        },
    },
};


export default store;
