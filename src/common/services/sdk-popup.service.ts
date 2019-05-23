import { ErrorModule } from '@/common/error';

export class SdkPopupService {
    static openWindow: any = null;

    static open(payload: any, res: any) {
        if (this.openWindow) {
            this.openWindow.close();
            this.openWindow = null;
        }

        const width = 375;
        const height = 622;
        const screen = window.screen;
        const left = (screen.width / 2) - (width / 2);
        const top = (screen.height / 2) - (height / 2);

        const url = chrome.runtime.getURL('/sdk/sdk.html');
        this.openWindow = window.open(
            url,
            'EOSTOCK',
            `width=${width},height=${height},top=${top},left=${left},titlebar=0,resizable=0,scrollbars=no`,
        );
        this.openWindow.data = {res, payload};

        this.openWindow.onbeforeunload = () => {
            this.openWindow = null;
            res(ErrorModule.closePopup(), null);
            return null;
        };
    }
}
