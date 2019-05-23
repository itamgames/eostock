import { SdkPopupService } from '@/common/services/sdk-popup.service';
import { ChromeStorageService } from '@/common/services/chrome-storage.service';
import { ErrorModule } from '@/common/error';

class Background {
    private static password: string = '';
    private static timeout: any;

    constructor() {
        this.subscribe();
    }

    subscribe() {
        chrome.runtime.onMessage.addListener(
            (request: any, sender: any, res: any) => {
                if (sender.id !== chrome.runtime.id) {
                    return;
                }

                this.dispenseMessage(res, request);
                return true;
            },
        );
    }

    dispenseMessage(res: any, payload: any) {
        const type = payload.type;
        switch (type) {
            case 'autoLock':
                Background.autoLock(res, payload.data);
                break;
            case 'unlock':
                Background.unlock(res, payload.data);
                break;
            case 'get':
                Background.get(res);
                break;
            case 'lock':
                Background.lock(res);
                break;
            case 'isLock':
                Background.isLock(res);
                break;
            case 'login':
                Background.login(type, payload.data, res);
                break;
            case 'logout':
                Background.logout(type, payload.data, res);
                break;
            case 'prompt':
                Background.prompt(type, payload.data, res);
                break;
        }
    }

    static async login(type: string, payload: any, res: any) {
        const host = payload.host;
        const identity = await ChromeStorageService.get(host);

        if (!identity) {
            SdkPopupService.open({type, payload}, (error: Error, _identity: string) => {
                if (error) {
                    res({error});
                } else {
                    res(_identity);
                    ChromeStorageService.set(host, _identity);
                }
            });
        } else {
            res(identity);
        }

    }

    static async logout(type: string, payload: any, res: any) {
        const host = payload.host;
        try {
            await ChromeStorageService.remove(host);
        } catch (e) {
            res(e);
        }
        res();
    }

    static async prompt(type: string, payload: any, res: any) {
        const host = payload.host;
        const identity = await ChromeStorageService.get(host);

        if (identity) {
            SdkPopupService.open({type, ...payload}, (error: Error, result: any) => {
                if (error) {
                    res({error});
                } else {
                    res(result);
                }
            });
        } else {
            res({error: ErrorModule.checkLogin()});
        }

    }

    static autoLock(res: any, {immediate, enable}: any) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (enable) {
            this.timeout = setTimeout(() => {
                this.password = '';
                res(!this.password);
            }, immediate);
        } else {
            res(!!this.password);
        }
    }

    static unlock(res: any, password: string) {
        this.password = !password ? '' : password;
        res(true);
    }

    static lock(res: any) {
        this.password = '';
        res(true);
    }

    static get(res: any) {
        res(this.password);
    }

    static isLock(res: any) {
        res(!!this.password);
    }
}

const background = () => new Background();

background();
