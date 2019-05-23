export const chromeRuntimeSend = (type: string, data?: any) =>
    new Promise((resolve: any, reject: any) => {
        // 크롬 익스텐션인지를 알기 위해 chrome.storage를 체크함
        chrome.runtime.sendMessage(
            {type, data},
            (response: any) => {
                if (response && response.error) {
                    reject(response.error);
                } else {
                    resolve(response);
                }
            });
    });
