import { SUPPORT_NETWORK } from '@/common/config';

export const goBlockExplorerUser = (networkName: string, accountName: string) => {
    const networkInfo = SUPPORT_NETWORK[networkName];

    if (networkInfo) {
        const url = SUPPORT_NETWORK[networkName].blockExplorer + 'account/' + accountName;
        chrome.tabs.create({url});
        return true;
    } else {
        return false;
    }
};

export const goBlockExplorerTransaction = (networkName: string, transactionId: string) => {
    const networkInfo = SUPPORT_NETWORK[networkName];

    if (networkInfo && networkInfo.blockExplorer) {
        const url = networkInfo.blockExplorer +
            (networkName === 'EOS Kylinnet' ? 'tx/' : 'transaction/') + transactionId;
        chrome.tabs.create({url});
        return true;
    } else {
        return false;
    }
};

export const supprotNetwork = (networkName: string) => !!SUPPORT_NETWORK[networkName];
