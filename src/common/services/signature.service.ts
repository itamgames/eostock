const EOS = require('eosjs');
const ecc = EOS.modules.ecc;

const parseRequestData = async (eos: any, actions: any[]) => {
    return await Promise.all(actions.map(async (action: any) => {
        let fc;

        if (eos.fc.hasOwnProperty('abi')) {
            fc = eos.fc;
        } else {
            fc = (await eos.contract(action.account)).fc;
        }

        action.data = fc.fromBuffer(action.name, action.data);
        return action;
    }));
};

export class SignatureService {
    static sign(buffer: any, privateKey: string) {
        return ecc.sign(Buffer.from(buffer, 'utf8'), privateKey);
    }

    static signatureProvider(messageSender: any) {
        return (config: any, eos: any) => {
            return new Proxy(eos(config), {
                get(eosInstance, method) {
                    let _contractInstance: any;

                    // Catching chained promise methods ( contract .then action )
                    const getContractProxy = (result: any) => {
                        return new Proxy(result, {
                            get(instance: any, _method: string) {
                                _contractInstance = instance;

                                if (_method === 'then') {
                                    return instance[_method];
                                }

                                return (...args: any[]) => {
                                    return new Promise((res, rej) => {
                                        instance[_method](...args).then((actionResult: any) => {
                                            res(actionResult);
                                        }).catch(rej);
                                    });
                                };
                            }, // getter
                        }); // proxy
                    };

                    return (...args: any[]) => {
                        const signProvider = async ({buf, transaction}: any) => {
                            let actions = null;
                            const hasActions = args.find((arg) => arg.hasOwnProperty('actions'));

                            if (hasActions) {
                                actions = transaction.actions.map((action: any, i: number) => {
                                    return Object.assign(action, args[0].actions[i]);
                                });
                            } else {
                                const _instance = _contractInstance ? _contractInstance : eosInstance;
                                actions = await parseRequestData(_instance, transaction.actions);
                            }

                            return await messageSender('prompt', {buf, actions});
                        };

                        return new Promise((resolve, reject) => {
                            eos(Object.assign(config, {signProvider}))[method](...args)
                                .then((result: any) => {
                                    if (!result.hasOwnProperty('fc')) {
                                        resolve(result);
                                    }

                                    resolve(getContractProxy(result));

                                })
                                .catch((e: any) => {
                                    reject(e);
                                });
                        });
                    };
                }, // getter
            }); // proxy
        };

    }// signatureProvider

}
