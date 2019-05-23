import { Account, Network } from '../account/account.interface';

export interface Wallet {
    create?: any;
    accounts?: Account[] | any;
}

interface WalletState {
    wallet: Wallet;
    isLock: boolean;
    accountsByKey: any;
    encryptWallet: string;
    networks: { [key: string]: Network; };
}

export interface WalletStore {
    state: WalletState;
    actions: {
        createWallet(
            {commit, dispatch}: any,
            account: any,
        ): void;
        signInWallet({commit, dispatch}: any, password: string): void;
        unlockWallet(
            {commit}: any,
            {password, wallet, encryptWallet}: { password: string, wallet: Wallet, encryptWallet: string },
        ): void;
        loadWallet({commit, dispatch}: any): void;
        lock({commit}: any): void;
        addAccountToWallet({commit, state}: any, account: Account): void;
        getAccountsByKey(
            {commit, dispatch, getters}: any,
            {privateKey, network}: { privateKey: string, network: Network },
        ): void;
        clearAccountsByKey({commit}: any): void;
        removeAccount({commit, state, dispatch}: any, account: Account): void;
        importWallet(
            {commit}: any,
            {password, encryptWallet}: { password: string, encryptWallet: string },
        ): void;
        clearWalletAll({commit}: any): void;
        initNetworks({commit}: any): void;
        addCustomNetwork({commit}: any, network: Network): void;
        deleteCustomNetwork({commit}: any, networkName: string): void;
    };
    getters: {
        walletIsLock(state: WalletState): boolean;
        accounts(state: WalletState): Account[];
        accountsByKey(state: WalletState): string[];
        encryptWallet(state: WalletState): string;
        wallet(state: WalletState): Wallet;
        networks(state: WalletState): { [key: string]: Network; };
    };
    mutations: {
        setWallet(state: WalletState, wallet: Wallet): void;
        isLock(state: WalletState, isLock: boolean): void;
        setAccountsByKey(state: WalletState, accounts: string[]): void;
        setEncryptWallet(state: WalletState, encryptWallet: string): void;
        clearWalletAll(state: WalletState): void;
        setNetworks(state: WalletState, networks: { [key: string]: Network }): void;
    };
}
