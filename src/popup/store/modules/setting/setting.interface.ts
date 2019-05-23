export interface AutoLock {
    enable: boolean;
    immediate: number;
}

interface State {
    autoLock: AutoLock;
    language: string;
}

export interface SettingStore {
    state: State;
    actions: {
        checkPassword({commit, getters, dispatch}: any, password: string): void;
        changePassword(
            {commit, getters, dispatch}: any,
            {oldPassword, newPassword}: { oldPassword: string, newPassword: string },
        ): void;
        checkAutoLock({commit, state, getters}: any, immediate?: boolean): void;
        setAutoLock({commit, state, getters}: any, immediate?: boolean): void;
        initAutoLock({commit, state, getters}: any): void;
        setLanguage({commit}: any, language: string): void;
        reset({dispatch}: any): void;
        settingClear({commit}: any): void;
    };
    getters: {
        autoLock(state: State): AutoLock;
        language(state: State): string;
    };
    mutations: {
        setAutoLock(state: State, autoLock: AutoLock): void;
        setLanguage(state: State, language: string): void;
        settingClear(state: State): void;
    };
}
