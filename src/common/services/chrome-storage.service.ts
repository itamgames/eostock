export class ChromeStorageService {
    static get(key: string): any {
        return new Promise((resolve) => {
            chrome.storage.local.get(key, (result: any) => {
                resolve(result[key]);
            });
        });
    }

    static set(key: string, value: any): any {
        return new Promise((resolve) => {
            const data: any = {};
            data[key] = value;
            chrome.storage.local.set(data, () => {
                resolve(true);
            });
        });
    }

    static remove(key: string): any {
        return new Promise((resolve) => {
            const data: any = {[key]: null};
            chrome.storage.local.set(data, () => {
                resolve(true);
            });
        });
    }

    static clear(): any {
        return new Promise((resolve) => {
            chrome.storage.local.clear(() => {
                resolve(true);
            });
        });
    }
}
