import { EosService } from '../../../../common/services/eos.service';
import { ContractStore } from '@/popup/store/modules/contract/contract.interface';
import { i18n } from '@/common/i18n';
import { ErrorModule } from '@/common/error';

const contractStore: ContractStore = {
    state: {
        contract: {},
        burnSymbols: [],
        actions: [],
    },
    actions: {
        async getContract({getters, commit, dispatch}) {
            dispatch('loading');
            try {
                const account = getters.nowAccountName;
                const myContract = await EosService.Instance.getContract(account);

                // symbols
                const symbols = [];
                if (!!myContract.burn) {
                    const tokens = await EosService.Instance.getCurrencyBalance(account, account);
                    for (const token of tokens) {
                        symbols.push({
                            asset: token,
                            symbol: token.split(' ')[1],
                        });
                    }
                }

                // actions
                const fc = myContract.fc;
                const actions = [];
                if (fc) {
                    const structs: any = fc.structs;
                    for (const action of fc.abi.actions) {
                        const name = action.name;
                        actions.push({name, fields: Object.keys(structs[name].fields)});
                    }
                }

                commit('burnSymbols', symbols);
                commit('actions', actions);
                commit('contract', myContract);
            } finally {
                dispatch('unLoading');
            }
        },
        async getMyContractToken({getters}, {symbol}) {
            const account = getters.nowAccountName;
            const token = (await EosService.Instance.getCurrencyBalance(account, account, symbol))[0];

            return {
                asset: token,
                symbol: token.split(' ')[1],
            };
        },
        async burn({getters, commit, dispatch}, {symbol, quantity}) {
            dispatch('loading');
            try {
                const account = getters.nowAccountName;
                const result = await EosService.Instance.transaction([
                    {
                        account,
                        name: 'burn',
                        authorization: [{actor: account, permission: 'active'}],
                        data: {
                            owner: account,
                            quantity: `${Number(quantity).toFixed(4)} ${symbol}`,
                        },
                    }]);
                dispatch('openTransactionModal', result.transaction_id);
            } catch (e) {
                ErrorModule.errorModal(dispatch, e, i18n.t('error.issueToken'));
            } finally {
                dispatch('unLoading');
            }
        },
        async runAction({getters, commit, dispatch}, {action, data}) {
            dispatch('loading');
            try {
                const account = getters.nowAccountName;
                const result = await EosService.Instance.transaction([
                    {
                        account,
                        name: action,
                        authorization: [{actor: account, permission: 'active'}],
                        data,
                    }]);
                dispatch('openTransactionModal', result.transaction_id);
            } catch (e) {
                ErrorModule.errorModal(dispatch, e, i18n.t('error.runAction'));
            } finally {
                dispatch('unLoading');
            }
        },
        async issueToken({getters, dispatch}, {maxSupply, symbol, memo}) {
            dispatch('loading');
            try {
                const eos = EosService.Instance;
                const account = getters.nowAccountName;
                const myContract = await eos.getContract(account);

                if (!myContract.create || !myContract.issue || !myContract.transfer) {
                    const tokenContract = require('../../../assets/token-contract.json');
                    // 컨트렉트 배포
                    const wasm = Buffer.from(tokenContract.code.data);
                    const abi = Buffer.from(tokenContract.abi);

                    await eos.deployContract(account, wasm, abi);
                }
                // 토큰 만들기 / 토큰 발행
                const maxSupplyWithSymbol = Number(maxSupply).toFixed(4) + ' ' + symbol.toUpperCase();
                const result = await eos.transaction([
                    {
                        account,
                        name: 'create',
                        authorization: [{actor: account, permission: 'active'}],
                        data: {
                            issuer: account,
                            maximum_supply: maxSupplyWithSymbol,
                        },
                    },
                    {
                        account,
                        name: 'issue',
                        authorization: [{actor: account, permission: 'active'}],
                        data: {
                            to: account,
                            quantity: maxSupplyWithSymbol,
                            memo,
                        },
                    },
                ]);
                dispatch('openTransactionModal', result.transaction_id);
            } catch (e) {
                ErrorModule.errorModal(dispatch, e, i18n.t('error.issueToken'));
            } finally {
                dispatch('unLoading');
            }
        },
        async deployContract({getters, dispatch}, {abiFile, wasmFile}) {
            dispatch('loading');
            try {
                const account = getters.nowAccountName;
                const result: any = await EosService.Instance.deployContract(account, wasmFile, abiFile);
                dispatch('openTransactionModal', result.transaction_id);
            } catch (e) {
                dispatch('setErrorModal', {
                    error: i18n.t('error.deployContract'),
                    detail: JSON.parse(e).error.details[0].message,
                });
            } finally {
                dispatch('unLoading');
            }
        },
    },
    getters: {
        hasBurn: (state) => !!state.contract.burn,
        burnSymbols: (state) => state.burnSymbols,
        actions: (state) => state.actions,
    },
    mutations: {
        contract(state, contract): void {
            state.contract = contract;
        },
        burnSymbols(state, symbols): void {
            state.burnSymbols = symbols;
        },
        actions(state, actions): void {
            state.actions = actions;
        },
    },
};

export default contractStore;
