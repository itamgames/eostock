export interface Account {
    network: {
        name: 'mainNet' | 'jungleNet' | string;
        httpEndpoint?: string;
        chainId?: string;
    };
    privateKey: string;
    name: string;
    ssoToken: string;
}

interface Wallet {
    create?: any;
    accounts?: Account[] | any;
}

interface AutoLock {
    enable: boolean;
    immediate: number;
}

interface WalletState {
    wallet: Wallet;
    isLock: boolean;
    autoLock: AutoLock;
    hasWallet: boolean;
    account: Account | any;
}

export interface WalletStore {
    state: WalletState;
    actions: {
        signInWallet({commit, dispatch}: any, password: string): void;
        loadWallet({commit, dispatch}: any): void;
        checkAutoLock({commit, state, getters}: any, immediate?: boolean): void;
        initAutoLock({commit, state, getters}: any): void;
        getAccount({commit, getters}: any, host: string): void;
    };
    getters: {
        walletIsLock(state: WalletState): boolean;
        accounts(state: WalletState): Account[];
        hasWallet(state: WalletState): boolean;
        account(state: WalletState): Account;
    };
    mutations: {
        setWallet(state: WalletState, wallet: Wallet): void;
        isLock(state: WalletState, isLock: boolean): void;
        setAutoLock(state: WalletState, autoLock: AutoLock): void;
        clearWalletAll(state: WalletState): void;
        hasWallet(state: WalletState, hasWallet: boolean): void;
        setAccount(state: WalletState, account: Account): void;
    };
}
