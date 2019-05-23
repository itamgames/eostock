export const INJECT_EVENT_BUS_NAME = 'EOSTOCK_INJECT';
export const CONTENT_EVENT_BUS_NAME = 'EOSTOCK_CONTENT';


export class EventBusService {
    private eventName: string = '';

    constructor(eventName: string) {
        this.eventName = eventName;
    }

    subscribe(func: any) {
        document.addEventListener(this.eventName, (event: any) => {
            const message = JSON.parse(event.detail);

            func(message.type, message.payload, message.id);
        });
    }

    send(to: string, type: string, payload?: any, id?: string) {
        const eventInitDict: { detail: any } = {detail: JSON.stringify({type, payload, id})};
        document.dispatchEvent(new CustomEvent(to, eventInitDict));
    }
}
