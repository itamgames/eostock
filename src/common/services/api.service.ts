import axios from 'axios';

export class ApiService {
    private static instance: ApiService = new ApiService();

    constructor() {
        if (ApiService.instance) {
            throw new Error('Error: Instantiation failed: Use EosService.getInstance() instead of new.');
        }
        ApiService.instance = this;
    }

    static get Instance(): ApiService {
        return ApiService.instance;
    }

    async getTokens(accountName: string) {
        const result: any = await axios.get(`https://api.light.xeos.me/api/account/eos/${accountName}`);
        return result.data;
    }
}
