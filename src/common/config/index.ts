export const SUPPORT_NETWORK: any = {
    'EOS Mainnet': {
        name: 'EOS Mainnet',
        httpEndpoint: 'https://proxy.eosnode.tools',
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        symbol: 'EOS',
        blockExplorer: 'https://bloks.io/',
    },
    'BOS Mainnet': {
        name: 'BOS Mainnet',
        httpEndpoint: 'https://bos-api.eoseoul.io',
        chainId: 'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86',
        symbol: 'BOS',
        blockExplorer: 'https://bos.bloks.io/',
    },
    'EOS Kylinnet': {
        name: 'EOS Kylinnet',
        httpEndpoint: 'https://api-kylin.eosasia.one',
        chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
        symbol: 'EOS',
        blockExplorer: 'https://kylin.eosx.io/',
    },
    'EOS Junglenet': {
        name: 'EOS Junglenet',
        httpEndpoint: 'http://dev.cryptolions.io:38888',
        chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        symbol: 'EOS',
    },
    'EOS Junglenet2': {
        name: 'EOS Junglenet2',
        httpEndpoint: 'https://api.jungle.alohaeos.com',
        chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
        symbol: 'EOS',
        blockExplorer: 'https://jungle.bloks.io/',
    },
};

// 전버젼을 위해서 필요.
export const BEFORE_NETWORK: any = {
    mainNet: {
        name: 'EOS Mainnet',
        httpEndpoint: 'https://proxy.eosnode.tools',
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        symbol: 'EOS',
    },
    jungleNet: {
        name: 'EOS Junglenet',
        httpEndpoint: 'http://dev.cryptolions.io:38888',
        chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        symbol: 'EOS',
    },
    kylinNet: {
        name: 'EOS Kylinnet',
        httpEndpoint: 'https://api-kylin.eosasia.one',
        chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
        symbol: 'EOS',
    },
    bosNet: {
        name: 'BOS Mainnet',
        httpEndpoint: 'https://bos-api.eoseoul.io',
        chainId: 'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86',
        symbol: 'BOS',
    },
};


export const EOS_CONFIG = {
    expireInSeconds: 60,
    broadcast: true,
    debug: false,
    sign: true,
};
