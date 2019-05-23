export class ErrorModule {
    code!: number;
    message!: string;
    type!: string;

    constructor(code: number, message: string, type: string) {
        this.code = code;
        this.message = message;
        this.type = type;
    }

    static closePopup() {
        return new ErrorModule(400, 'close popup', 'CLOSE_POPUP');
    }

    static checkToken() {
        return new ErrorModule(401, 'check token', 'CHECK_TOKEN');
    }

    static reject() {
        return new ErrorModule(100, 'User rejected signature request', 'USER_REJECT');
    }

    static checkLogin() {
        return new ErrorModule(101, 'Please login first.', 'CHECK_LOGIN');
    }

    static checkParam() {
        return new ErrorModule(102, 'Please check params', 'CHECK_PARAM');
    }

    static checkType() {
        return new ErrorModule(103, 'Please check params Type', 'CHECK_TYPE');
    }

    static errorModal(dispatch: any, e: any, errorMessage: string) {
        let detail = null;
        try {
            detail = JSON.parse(e).error.details[0].message;
        } catch (error) {
            detail = e.message;
        }
        dispatch('setErrorModal', {
            error: errorMessage,
            detail,
        });
    }
}
