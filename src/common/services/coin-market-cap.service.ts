import axios from 'axios';

export class CoinMarketCapService {
    private static instance: CoinMarketCapService = new CoinMarketCapService();

    coins: any[] = [];

    constructor() {
        if (CoinMarketCapService.instance) {
            throw new Error('Error: Instantiation failed: Use EosService.getInstance() instead of new.');
        }
        CoinMarketCapService.instance = this;
    }

    static get Instance(): CoinMarketCapService {
        return CoinMarketCapService.instance;
    }

    async getCoins() {
        const result: any = await axios.get('https://api.coinmarketcap.com/v2/listings/');
        this.coins = result.data.data;
    }

    async getCoinBySymbol(symbol: string) {
        if (this.coins) {
            await this.getCoins();
        }

        const coinInfo = (this.coins.filter((coin: any) => coin.symbol === symbol))[0];
        if (!coinInfo) {
            return null;
        }

        const result: any = await axios.get(`https://api.coinmarketcap.com/v2/ticker/${coinInfo.id}/`);
        return result.data.data;
    }

    async getCoinPriceBySymbol(symbol: string) {
        if (this.coins) {
            await this.getCoins();
        }

        const coinInfo = (this.coins.filter((coin: any) => coin.symbol === symbol))[0];
        if (!coinInfo) {
            return null;
        }

        const result: any = await axios.get(`https://api.coinmarketcap.com/v2/ticker/${coinInfo.id}/`);
        return result.data.data.quotes.USD.price;
    }

    async getCoin(id: string) {
        const result: any = await axios.get(`https://api.coinmarketcap.com/v2/ticker/${id}/`);
        return result.data.data;
    }

    async getCoinPrice(id: string) {
        const result: any = await axios.get(`https://api.coinmarketcap.com/v2/ticker/${id}/`);
        return result.data.data.quotes.USD.price;
    }
}
