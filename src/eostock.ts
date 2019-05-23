import { CONTENT_EVENT_BUS_NAME, EventBusService } from '@/common/services/event-bus.service';
import { SignatureService } from '@/common/services/signature.service';
import { ErrorModule } from '@/common/error';

let eventBus: any = new WeakMap();
let results: any = new WeakMap();
const _subscribe = () => {
    eventBus.subscribe((type: string, payload: any, id: string) => {
        const result = results[id];
        if (result) {
            if (payload && payload.error) {
                result.reject(payload.error);
            } else {
                result.resolve(payload);
            }

            delete results[id];
        }
    });
};

const _send = (type: string, payload?: any) => new Promise((resolve, reject) => {
    const id = new Date().getTime();
    results[id] = {resolve, reject};
    eventBus.send(CONTENT_EVENT_BUS_NAME, type, payload, id);
});

export class Eostock {
    eos: any;

    constructor(_eventBus: EventBusService) {
        eventBus = _eventBus;
        results = {};
        this.eos = SignatureService.signatureProvider(_send);
        _subscribe();
    }

    login(networks: any[] | any) {
        const host = document.location.host;

        if (!networks) {
            throw ErrorModule.checkParam();
        } else if (typeof networks !== 'object') {
            throw ErrorModule.checkType();
        }

        if (!(networks instanceof Array)) {
            networks = [networks];
        }

        for (const network of networks) {
            if (!(network.chainId && network.httpEndpoint)) {
                throw ErrorModule.checkParam();
            }
        }

        return _send('login', {host, networks});
    }

    logout() {
        const host = document.location.host;
        return _send('logout', {host});
    }

    /******** DEPRECATED **********/
    selectIdentity(networks: any[]) {
        return this.login(networks);
    }

}
