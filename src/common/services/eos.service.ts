import { EOS_CONFIG } from '@/common/config';

const EOS = require('eosjs');
const ecc = EOS.modules.ecc;

interface Action {
    account: string;
    name: string;
    authorization: [{ actor: string, permission: 'active' }];
    data: any;
}

export class EosService {
    private static instance: EosService = new EosService();
    private config: any = EOS_CONFIG;
    private contractName: string = '';
    private eos: any = null;

    constructor() {
        if (EosService.instance) {
            throw new Error('Error: Instantiation failed: Use EosService.getInstance() instead of new.');
        }
        EosService.instance = this;
    }

    static get Instance(): EosService {
        return EosService.instance;
    }

    setEos(network: any) {
        const config = Object.assign(this.config, network);
        this.eos = new EOS(config);
    }

    setKeyProvider(privateKey: string) {
        this.config.keyProvider = [privateKey];
    }

    /**
     * private key를 사용하여 계정들을 가지고 온다.
     *
     * @param {string} privateKey
     * @returns {Promise<Promise<any>>}
     */
    async getKeyAccounts(privateKey: string) {
        const publicKey = this.getPublicKey(privateKey);
        const result: any = await this.eos.getKeyAccounts({public_key: publicKey});
        return result.account_names;
    }

    /**
     * 퍼블릭키를 가지고 온다.
     *
     * @param privateKey
     */
    getPublicKey(privateKey: string) {
        return ecc.privateToPublic(privateKey);
    }

    /**
     * 해당 data를 싸인한다.
     *
     * @param data
     * @param privateKey
     */
    sign(data: any, privateKey: string): string {
        return ecc.sign(data, privateKey);
    }

    /**
     * 컨트렉트를 배포 합니다.
     *
     * @param account
     * @param wasmFile
     * @param abiFile
     */
    deployContract(account: string, wasmFile: any, abiFile: any) {
        const code = wasmFile;

        return this.eos.transaction({
            actions: [
                {
                    account: 'eosio',
                    name: 'setcode',
                    authorization: [{actor: account, permission: 'active'}],
                    data: {
                        account,
                        vmtype: 0,
                        vmversion: 0,
                        code,
                    },
                },
                {
                    account: 'eosio',
                    name: 'setabi',
                    authorization: [{actor: account, permission: 'active'}],
                    data: {
                        account,
                        abi: JSON.parse(abiFile),
                    },
                },
            ],
        });
    }

    /**
     * 컨트렉트 정보를 가지고 온다.
     *
     * @param {string} account
     * @returns {Promise<any>}
     */
    async getContract(account: string) {
        let result = null;
        try {
            result = await this.eos.contract(account);
        } catch (e) {
            result = {};
        }
        return result;
    }

    /**
     * 신규 계정을 생성한다.
     * @param creator
     * @param accountName
     * @param ownerKey
     * @param activeKey
     * @param ram
     * @param cpu
     * @param net
     */
    createAccount(creator: string, {
        accountName,
        ownerKey,
        activeKey,
        quant,
        bytes,
        cpu,
        net,
        transfer,
    }: any) {
        return this.eos.transaction((tr: any) => {
            tr.newaccount({
                creator,
                name: accountName,
                owner: ownerKey,
                active: activeKey,
            });

            if (quant) {
                tr.buyram({
                    payer: creator,
                    receiver: accountName,
                    quant,
                });
            }

            if (bytes) {
                tr.buyrambytes({
                    payer: creator,
                    receiver: accountName,
                    bytes,
                });
            }

            tr.delegatebw({
                from: creator,
                receiver: accountName,
                stake_net_quantity: net,
                stake_cpu_quantity: cpu,
                transfer,
            });
        });
    }

    async refund(owner: string) {
        return this.eos.transaction({
            actions: [{
                account: 'eosio.token',
                name: 'refund',
                authorization: [{actor: owner, permission: 'active'}],
                data: {
                    owner,
                },
            }],
        });
    }

    /**
     * 코인을 전송한다.
     *
     * @param {string} privateKey
     * @param {string} from
     * @param {string} to
     * @param {string} balance
     * @returns {Promise<any>}
     */
    async transfer(from: string, to: string, quantity: number, memo: string = '',
                   contractName: string = this.contractName, symbol: string = 'EOS') {
        return this.eos.transaction({
            actions: [{
                account: contractName,
                name: 'transfer',
                authorization: [{actor: from, permission: 'active'}],
                data: {from, to, quantity: `${quantity.toFixed(4)} ${symbol}`, memo},
            }],
        });
    }

    /**
     * 컨트렉트의 action을 실행 한다. 추후에 다 수정해야된다.
     *
     * @param contractName
     * @param action
     * @param authorization
     * @param data
     */
    async transaction(actions: Action[]) {
        return this.eos.transaction({
            actions,
        });
    }

    /**
     * account에 코인이 얼마 있는지 체크한다.
     *
     * @param {string} account
     * @returns {Promise<Promise<any>>}
     */
    async getCurrencyBalance(account: string, code: string = this.contractName, symbol?: string) {
        const params: any = {account, code};
        if (symbol) {
            params.symbol = symbol;
        }

        return this.eos.getCurrencyBalance(params);
    }

    /**
     * account의 정보를 가지고 온다.
     *
     * @param {string} account
     * @returns {Promise<any>}
     */
    async getAccountInfo(account: string) {
        return this.eos.getAccount({account_name: account});
    }

    /**
     * 테이블 데이터를 가지고 온다.
     *
     * @param {string} table
     * @returns {Promise<any>}
     */
    async tableRows(table: string) {
        const result: any = await this.eos.getTableRows({
            scope: 'eosio',
            code: 'eosio',
            table,
            limit: 100000,
            json: true,
        });

        return result.rows;
    }

    /**
     * 서버정보를 가지고 온다.
     *
     * @returns {Promise<any>}
     */
    async info() {
        return this.eos.getInfo();
    }

    /**
     * EOS 정보를 검색한다.
     *
     * @returns {Promise<any>}
     */
    async getCurrency(contrectName: string = 'eosio.token', symbol: string = 'EOS') {
        return this.eos.getCurrencyStats(contrectName, symbol);
    }

    /**
     * bp를 가지고 온다.
     *
     * @returns {Promise<any>}
     */
    async getProducers() {
        const result: any = await this.eos.getProducers({json: true, limit: 100000});
        return result.rows;
    }

    /**
     * stake
     *
     * @param from
     * @param receiver
     * @param stakeNetQuantity
     * @param stakeCpuQuantity
     * @param transfer
     */
    async delegate(from: string, receiver: string, cpuQuantity: number,
                   netQuantity: number, transfer: boolean, symbol: string) {
        const result: any = await this.eos.transaction((tr: any) => {
            tr.delegatebw({
                from,
                receiver,
                stake_net_quantity: `${netQuantity.toFixed(4)} ${symbol}`,
                stake_cpu_quantity: `${cpuQuantity.toFixed(4)} ${symbol}`,
                transfer: transfer ? 1 : 0,
            });
        });
        return result;
    }

    /**
     * undelegate
     *
     * @param from
     * @param receiver
     * @param stakeNetQuantity
     * @param stakeCpuQuantity
     * @param transfer
     */
    async undelegate(from: string, receiver: string, cpuQuantity: number, netQuantity: number, symbol: string) {
        return await this.eos.transaction((tr: any) => {
            tr.undelegatebw({
                from,
                receiver,
                unstake_net_quantity: `${netQuantity.toFixed(4)} ${symbol}`,
                unstake_cpu_quantity: `${cpuQuantity.toFixed(4)} ${symbol}`,
                transfer: 0,
            });
        });
    }

    /**
     * ram을 산다. (EOS 기준)
     *
     * @param payer
     * @param receiver
     * @param quant
     */
    async buyRam(payer: string, receiver: string, quant: number, symbol: string) {
        return await this.eos.transaction((tr: any) => {
            tr.buyram({
                payer,
                receiver,
                quant: `${quant.toFixed(4)} ${symbol}`,
            });
        });
    }

    /**
     * ram을 산다. (bytes 기준)
     *
     * @param payer
     * @param receiver
     * @param bytes
     */
    async buyRamBytes(payer: string, receiver: string, bytes: number) {
        return await this.eos.transaction((tr: any) => {
            tr.buyrambytes({
                payer,
                receiver,
                bytes: Number(bytes),
            });
        });
    }

    /**
     * ram을 팔다.
     *
     * @param account
     * @param bytes
     */
    async sellRam(account: string, bytes: number) {
        return await this.eos.transaction((tr: any) => {
            tr.sellram({
                account,
                bytes: Number(bytes),
            });
        });
    }

    /**
     * 트렌젝션 정보를 가지고 온다.
     *
     * @param id
     * @returns {Promise<Promise<any>>}
     */
    async getTransaction(id: any) {
        return this.eos.getTransaction({id});
    }

}
