import { EosService } from '../../../../common/services/eos.service';
import { AccountStore, CustomToken, Network } from './account.interface';
import { CoinMarketCapService } from '../../../../common/services/coin-market-cap.service';
import { decrypt } from '../../../../common/utils/crypto.utils';
import { chromeRuntimeSend } from '../../../../common/services/chrome-runtime.service';
import { ApiService } from '@/common/services/api.service';
import { ChromeStorageService } from '@/common/services/chrome-storage.service';

const sort = require('fast-sort');

const accountStore: AccountStore = {
    state: {
        account: {
            network: {
                name: '',
                httpEndpoint: '',
                chainId: '',
                symbol: '',
            },
            mainSymbol: '',
            privateKey: '',
            name: '',
            balance: {
                unstaked: {eos: 0, rate: 0},
                staked: {eos: 0, rate: 0},
                refund: {eos: 0, rate: 0},
                price: 0,
                total: {eos: 0, rate: 0},
            },
            resource: {
                cpu: {max: 0, used: 0, rate: 0, eos: 0},
                bandwidth: {max: 0, used: 0, rate: 0, eos: 0},
                ram: {max: 0, used: 0, rate: 0, eos: 0},
            },
        },
        nowAccountName: '',
        customTokens: {},
    },
    actions: {
        async clearAccountStore({commit}) {
            commit('clearAccountStore');
        },
        async createAccount({dispatch, state}, newAccountInfo) {
            const eos = EosService.Instance;

            try {
                dispatch('loading');
                const result = await eos.createAccount(state.nowAccountName, newAccountInfo);
                dispatch('openTransactionModal', result.transaction_id);
            } catch (e) {
                let error = '';
                if (typeof e === 'string') {
                    error = JSON.parse(e).error.details.shift().message;
                } else {
                    error = e.message.includes('Invalid character') ? 'Invalid Account Name' : e.message;
                }
                dispatch('unLoading');
                dispatch('setErrorModal', {error});
            } finally {
                dispatch('unLoading');
            }
        },
        async changeAccount({dispatch}, account) {
            dispatch('loading');
            try {
                await dispatch('getAccountInfo', account);
                await dispatch('getContract');
            } finally {
                dispatch('unLoading');
            }
        },
        async getAccountInfo({commit, dispatch, getters}, account) {
            const accountName = account.name;
            commit('clearCustomTokens');

            if (account.network.name === 'EOS Mainnet') {
                dispatch('getCustomTokens', accountName);
            }

            // header layout에 account name을 보녀주기 위해 초기 버젼을 넣는다.
            commit('setNowAccountName', accountName);
            ChromeStorageService.set('selectedAccount', accountName);
            const eos = EosService.Instance;
            const network: Network = account.network;
            const password: any = await chromeRuntimeSend('get');
            eos.setKeyProvider(decrypt(account.privateKey, password));
            eos.setEos(network);

            const info: any = await eos.getAccountInfo(accountName);

            const symbol: string = network.symbol;

            const refundReq = info.refund_request;
            const totalResources = info.total_resources || {};
            const unstaked = info.core_liquid_balance ? Number(info.core_liquid_balance.split(' ')[0]) : 0;
            const staked = info.voter_info ? info.voter_info.staked / 10000 : 0;
            let refund = 0;
            if (refundReq) {
                refund = Number(refundReq.net_amount.split(' ')[0]) +
                    Number(refundReq.cpu_amount.split(' ')[0]);
            }
            const total = Number((refund + unstaked + staked).toFixed(4));
            account.balance = {
                staked: {
                    eos: staked,
                    rate: staked / total * 100,
                },
                unstaked: {
                    eos: unstaked,
                    rate: unstaked / total * 100,
                },
                refund: {
                    eos: refund,
                    rate: refund / total * 100,
                },
                total: {
                    eos: total,
                },
                price: await CoinMarketCapService.Instance.getCoinPrice('1765'),
            };
            account.resource = {
                cpu: {
                    max: info.cpu_limit.max,
                    used: info.cpu_limit.used,
                    rate: info.cpu_limit.used / info.cpu_limit.max * 100,
                    eos: totalResources.cpu_weight || `0.0000 ${symbol}`,
                },
                bandwidth: {
                    max: info.net_limit.max,
                    used: info.net_limit.used,
                    rate: info.net_limit.used / info.net_limit.max * 100,
                    eos: totalResources.net_weight || `0.0000 ${symbol}`,
                },
                ram: {
                    max: info.ram_quota,
                    used: info.ram_usage,
                    rate: info.ram_usage / info.ram_quota * 100,
                },
            };

            account.mainSymbol = symbol;

            commit('setAccount', account);
        },
        async getCustomTokens({commit, dispatch}: any, accountName: any) {
            commit('clearCustomTokens');
            const accountInfo: any = await ApiService.Instance.getTokens(accountName);

            const tokens = [];
            for (const token of accountInfo.balances) {
                if (token.currency !== 'EOS') {
                    tokens.push({
                        contractName: token.contract,
                        symbol: token.currency,
                        balance: token.amount,
                    });
                }
            }

            commit('setCustomTokens', tokens);
        },
    },
    getters: {
        account: (state) => state.account,
        customTokens: (state) => {
            let customTokens: any[] = [];
            const stateCustomTokens = state.customTokens;
            for (const key of Object.keys(stateCustomTokens)) {
                customTokens.push(stateCustomTokens[key]);
            }

            if (customTokens.length > 0) {
                customTokens = sort(customTokens)
                    .desc((customToken: CustomToken) => Number(customToken.balance));
            }
            return customTokens;
        },
        nowAccountName: (state) => state.nowAccountName,
    },
    mutations: {
        clearAccountStore(state) {
            state.account = {};
        },
        setAccount(state, account) {
            state.account = {...account};
        },
        setCustomTokens(state, customTokens) {
            state.customTokens = customTokens;
        },
        clearCustomTokens(state) {
            state.customTokens = {};
        },
        setNowAccountName(state, nowAccountName) {
            state.nowAccountName = nowAccountName;
        },
    },
};

// @ts-ignore
export default accountStore;
