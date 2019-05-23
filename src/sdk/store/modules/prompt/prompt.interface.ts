export interface Prompt {
    contract: string;
    action: string;
    owner: string;
    value?: string;
    host: string;
}

interface PromptState {
    actions: Prompt[];
}

export interface PromptStore {
    state: PromptState;
    actions: {
        initPrompt({commit, dispatch}: any, args: any[]): void;
    };
    getters: {
        actions(state: PromptState): Prompt[];
    };
    mutations: {
        setActions(state: PromptState, actions: Prompt[]): void,
    };
}
