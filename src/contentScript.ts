import {
    CONTENT_EVENT_BUS_NAME,
    EventBusService,
    INJECT_EVENT_BUS_NAME,
} from '@/common/services/event-bus.service';
import { chromeRuntimeSend } from '@/common/services/chrome-runtime.service';

let eventBus: any = new WeakMap();

class ContentScript {
    constructor() {
        this.injectJs();
        this.eventBusSubscribe();

    }

    private eventBusSubscribe() {
        eventBus = new EventBusService(CONTENT_EVENT_BUS_NAME);
        eventBus.subscribe(this.dispenseSubscribe);
    }

    private dispenseSubscribe(type: string, payload: any, id: string) {
        switch (type) {
            case 'login':
                ContentScript.login(type, payload, id);
                break;
            case 'logout':
                ContentScript.logout(type, payload, id);
                break;
            case 'prompt':
                ContentScript.prompt(type, payload, id);
                break;
        }
    }

    static login(
        type: string,
        payload: any,
        id: string,
    ) {
        chromeRuntimeSend(type, payload)
            .then((identity: any) => eventBus.send(INJECT_EVENT_BUS_NAME, type, identity, id))
            .catch((e: Error) => eventBus.send(INJECT_EVENT_BUS_NAME, type, {error: e}, id));
    }

    static logout(
        type: string,
        payload: any,
        id: string,
    ) {
        chromeRuntimeSend(type, payload)
            .then((result: any) => eventBus.send(INJECT_EVENT_BUS_NAME, type, result, id))
            .catch((e: Error) => eventBus.send(INJECT_EVENT_BUS_NAME, type, {error: e}, id));
    }

    static prompt(
        type: string,
        payload: any,
        id: string,
    ) {
        payload.host =  document.location.host;
        chromeRuntimeSend(type, payload)
            .then((result: any) => eventBus.send(INJECT_EVENT_BUS_NAME, type, result, id))
            .catch((e: Error) => eventBus.send(INJECT_EVENT_BUS_NAME, type, {error: e}, id));
    }

    /**
     * injectJs를 주입한다.
     */
    private injectJs() {
        const script = document.createElement('script');
        script.src = chrome.extension.getURL('inject.js');
        (document.head || document.documentElement).appendChild(script);
        script.onload = () => script.remove();
    }
}

const contentScript = () => new ContentScript();

contentScript();
