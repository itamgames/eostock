<template>
    <section class="transfer">
        <div class="send">
            <div class="send-box">
                <div class="send-box__sender">
                    <h6 class="align-left">{{ $t('transfer').sendAccount }}</h6>
                    <div class="account-sender">
                        {{account.name}}
                    </div>
                </div>
                <div class="send-box__img">
                    <img alt="" src="../../assets/send-box-mid.png"/>
                </div>
                <div class="send-box__recip">
                    <h6 class="align-left">{{ $t('transfer').recipAccount }}</h6>
                    <input type="text" v-model="transferInfo.to" id="from" class="account-recip" maxlength="12"
                           :placeholder="$t('transfer').recipAccountPlace"/>
                </div>
            </div>
        </div>
        <div class="eos">
            <div class="pannel">
                <div class="col-row">
                    <div class="eos-wallet">
                        <h4>{{nowToken.symbol}}</h4>
                        <div v-if="balanceLoading">
                            <div class="loader">
                                <div class="loading"></div>
                                <div class="loading"></div>
                                <div class="loading"></div>
                            </div>
                        </div>
                        <p v-else>{{possibleBalance}}</p>
                    </div>
                    <div class="eos-active">
                        <button type="button" @click.prevent="isChangeToken = true" class="btn warning js-change">
                            <span>{{ $t('transfer').btnChange }}</span>
                        </button>
                        <dropdown v-model="isChangeToken">
                            <div class="token-select">
                                <h6>{{$t('transfer').btnChange}}</h6>
                                <ul class="token-select__list">
                                    <li>
                                        <button type="button" @click="changeToken({contractName: 'eosio.token', symbol: account.mainSymbol})"
                                                class="btn trans"
                                                :class="{ on: nowToken.symbol === account.mainSymbol }">
                                            <span>{{account.mainSymbol}}</span>
                                        </button>
                                    </li>
                                    <li v-for="(token, key) in customTokens" :key="key">
                                        <button type="button" @click="changeToken(token)"
                                                class="btn trans"
                                                :class="{ on: nowToken.symbol === token.symbol }">
                                            <span>{{ token.symbol }}</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </dropdown>
                    </div>
                </div>
                <div class="quantity">
                    <h6>{{ $t('transfer').quantity }}</h6>
                    <div class="col-row quantity-eos">
                        <input type="number" v-model="transferInfo.quantity" id="quantity" class="token"
                               placeholder="0.00"/>
                        <span class="unit">{{nowToken.symbol}}</span>
                    </div>
                </div>
                <div class="memo">
                    <h6>{{ $t('transfer').memo }}</h6>
                    <textarea v-model="transferInfo.memo" class="textarea"></textarea>
                </div>
            </div>
        </div>
        <div class="DH15"></div>
        <div class="h-gap-15">
            <button type="button" @click="openTransfer" class="btn submit">
                <span>{{ $t('transfer').btnTransfer }}</span>
            </button>
        </div>
        <modal v-model="isTransfer">
            <h6>{{ $t('transfer').modalRecip }}</h6>
            <p>
                {{transferInfo.to}}
            </p>

            <h6>{{ $t('transfer').quantity }}</h6>
            <p>
                {{transferInfo.quantity}} {{nowToken.symbol}}
            </p>

            <h6>{{ $t('transfer').memo }}</h6>
            <textarea v-model="transferInfo.memo" readonly class="textarea"></textarea>

            <ul class="col-row col-l-r modal-transfer__submit">
                <li class="col-1-2">
                    <button type="button" @click="closeTransfer" class="btn submit cancel">
                        <span>{{ $t('button').cancel }}</span>
                    </button>
                </li>
                <li class="col-1-2">
                    <button type="button" @click.prevent="transfer"
                            class="btn submit danger">
                        <span>{{ $t('button').accept }}</span>
                    </button>
                </li>
            </ul>
        </modal>
    </section>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import dropdown from '../../../common/components/dropdown/dropdown.component.vue';
    import modal from '../../../common/components/modal/modal.component.vue';
    import { EventBus } from '../../../common/services/vue-event-bus.service';
    import { mapGetters } from 'vuex';

    @Component({
    computed: {
        ...mapGetters([
            'account',
            'possibleBalance',
            'balanceLoading',
            'customTokens',
        ]),
    },
    components: {
        dropdown,
        modal,
    },
})
export default class Home extends Vue {
    transferInfo: any = {
        to: '',
        quantity: '',
        memo: '',
    };

    nowToken: any = {contractName: 'eosio.token', symbol: this.$store.getters.account.mainSymbol};
    isChangeToken: boolean = false;
    isTransfer: boolean = false;
    error: string = '';
    isTransferSuccess: boolean = false;

    created() {
        this.getPossibleBalance();
    }

    mounted() {
        this.focus('from');
        EventBus.$on('closeErrorModal', () => {
            this.closeModalFail();
        });
    }

    focus(id: string) {
        const el = document.getElementById(id);
        if (el) {
            el.focus();
        }
    }

    closeTransfer() {
        this.isTransfer = false;
    }

    async transfer() {
        try {
            await this.$store.dispatch('transfer', Object.assign(this.transferInfo, this.nowToken));
            this.getPossibleBalance();
            this.isTransfer = false;
            this.isTransferSuccess = true;
        } catch (e) {
            this.isTransfer = false;
            const error = this.$i18n.t('transfer.failMsg');
            try {
                this.$store.dispatch('setErrorModal', {error, detail: JSON.parse(e).error.details[0].message});
            } catch (e) {
                this.$store.dispatch('setErrorModal', {error});
            }
        }
    }

    getPossibleBalance() {
        this.$store.dispatch('getPossibleBalance', this.nowToken);
    }

    changeToken(token: any) {
        this.nowToken = token;
        this.getPossibleBalance();
    }

    openTransfer() {
        const quantity = this.transferInfo.quantity;
        if (!this.transferInfo.to) {
            this.error = 'errorToRequired';
        } else if (!this.transferInfo.quantity) {
            this.error = 'checkQuantity';
        } else if (this.$store.getters.possibleBalance < quantity) {
            this.error = 'errorQuantity';
        }

        if (this.error) {
            this.$store.dispatch('setErrorModal', {error: this.$i18n.t(`transfer.${this.error}`)});
            return;
        }

        this.isTransfer = true;
    }

    closeModalFail() {
        const error = this.error;
        this.error = '';
        if (error === 'errorToRequired') {
            this.focus('from');
        } else if (error === 'checkQuantity' || error === 'errorQuantity') {
            this.focus('quantity');
        }
    }

    @Watch('$store.getters.account')
    changeAccount() {
        this.getPossibleBalance();
    }
}
</script>

<style scoped lang="scss">
    .loader {
        width: 5em;
        min-height: 34px;
        line-height: 14px;
        position: relative;
        padding-top: 5px;

        .loading {
            width: 7px;
            height: 7px;
            margin-left: 5px;
            border-radius: 50%;
            background: rgba(0,0,0,0.8);
            float: left;
            animation-fill-mode: both;
            animation: load7 1.8s infinite ease-in-out;

            &:nth-child(1) {
                animation-delay: -0.16s;
            }

            &:first-child {
                animation-delay: -0.32s;
            }
        }
    }

    @keyframes load7 {
        0%,
        100% {
            opacity: 1;
        }
        40% {
            opacity: 0.1;
        }
    }
</style>
