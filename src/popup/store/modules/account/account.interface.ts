export interface Network {
    name: string;
    httpEndpoint: string;
    chainId: string;
    symbol: string;
}

export interface Account {
    network: Network;
    privateKey: string;
    name: string;
    token?: string;
    balance?: Balance;
    resource?: Resource;

    [key: string]: any;
}

export interface CustomToken {
    contractName: string;
    symbol: string;
    balance?: number;
}

interface Resource {
    cpu: ResourceDetail;
    bandwidth: ResourceDetail;
    ram: ResourceDetail;
}

interface ResourceDetail {
    max: number;
    used: number;
    rate: number;
    eos?: string | number;
}

interface BalanceDetail {
    eos: number;
    rate?: number;
}

interface Balance {
    unstaked: BalanceDetail;
    staked: BalanceDetail;
    refund: BalanceDetail;
    price: number;
    total: BalanceDetail;
}

interface AccountState {
    account: Account | any;
    nowAccountName: string;
    customTokens?: { [key: string]: CustomToken } | any;
}

interface NewAccountInfo {
    create: string;
    accountName: string;
    ownerKey: string;
    activeKey: string;
    ram: number;
    cpu: string;
    net: string;
}

export interface AccountStore {
    state: AccountState;
    actions: {
        changeAccount({dispatch}: any, account: Account): void;
        clearAccountStore({commit}: any): void;
        createAccount({dispatch, state}: any, newAccountInfo: NewAccountInfo): void;
        getAccountInfo({commit}: any, account: Account): void;
        getCustomTokens({commit, dispatch}: any, accountName: string): void;
    };
    getters: {
        account(state: AccountState): Account;
        customTokens(state: AccountState): CustomToken[];
        nowAccountName(state: AccountState): string;
    };
    mutations: {
        clearAccountStore(state: AccountState): void;
        clearCustomTokens(state: AccountState): void;
        setAccount(state: AccountState, account: Account): void;
        setCustomTokens(state: AccountState, customToken: CustomToken): void;
        setNowAccountName(state: AccountState, nowAccountName: string): void;
    };
}
