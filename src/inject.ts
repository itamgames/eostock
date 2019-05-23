import { EventBusService, INJECT_EVENT_BUS_NAME } from '@/common/services/event-bus.service';
import { Eostock } from '@/eostock';

declare const window: any;

class Inject {
    constructor() {
        const eventBus = new EventBusService(INJECT_EVENT_BUS_NAME);
        window.eosTock = new Eostock(eventBus);
        document.dispatchEvent(new CustomEvent('EOSTOCK_CONNECTED'));
    }
}

const inject = () => new Inject();

inject();
