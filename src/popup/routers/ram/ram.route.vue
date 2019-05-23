<template>
    <div class="ram transfer">
        <div class="radio-group-tab">
            <ul>
                <li>
                    <input type="radio" id="buy" :value="false" v-model="isSell" name="commercial"/>
                    <label for="buy">
                        <span v-html="$t('ram').buyRam">Buy RAM</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="sell" :value="true" v-model="isSell" name="commercial"/>
                    <label for="sell" @click="isPurchTypeBytes = true">
                        <span v-html="$t('ram').sellRam">Sell RAM</span>
                    </label>
                </li>
            </ul>
        </div>
        <!-- buy account -->
        <div v-if="!isSell" class="send">
            <div class="send-box">
                <div class="send-box__sender">
                    <h6 class="align-left" v-html="$t('stake').accountOwner">Stake Owner</h6>
                    <div class="account-sender">
                        {{account.name}}
                    </div>
                </div>
                <div class="send-box__img">
                    <img alt="" src="../../assets/send-box-mid.png"/>
                </div>
                <div class="send-box__recip">
                    <h6 class="align-left" v-html="$t('ram').accountRecipient">Recipient Account</h6>
                    <input type="text" class="account-recip" maxlength="12"
                           v-model="ram.receiver" id="receiver"
                           placeholder="Recipient"/>
                </div>
            </div>
        </div><!--// buy account -->

        <!-- sell account -->
        <div v-if="isSell">
            <div class="DH15"></div>
            <div class="pannel sell-box">
                <h6 v-html="$t('ram').account">Account</h6>
                <p>{{account.name}}</p>

                <div class="DH25"></div>

                <h6 v-html="$t('ram').availableForSale">Owned RAM</h6>
                <p>{{(myRam).toLocaleString()}} Bytes</p>
            </div>
            <div class="DH15"></div>
        </div>
        <!--// sell account -->

        <div class="ram-eos pannel">
            <div class="ram-box">
                <h4>{{ isSell ? $t('ram').sell : $t('ram').purchase }}</h4>
                <p>
                    <input type="number" v-model="ram.quantity" placeholder="0" id="quantity"/>
                    <span v-if="!isSell">{{ isPurchTypeBytes ? 'Bytes' : mainSymbol }}</span>
                    <span v-if="isSell">Bytes</span>
                </p>
                <div class="DH15"></div>
                <div class="purch-type">
                    <div class="radio-group small">
                        <span v-if="!isSell">
                            <input type="radio" id="radioEos" :value="false" v-model="isPurchTypeBytes"
                                   name="isTransfer"/>
                            <label for="radioEos">
                                <span>{{mainSymbol}}</span>
                            </label>
                        </span>

                        <input type="radio" id="radioBytes" :value="true" v-model="isPurchTypeBytes"
                               name="isTransfer"/>
                        <label for="radioBytes">
                            <span>Bytes</span>
                        </label>
                    </div>
                    <div class="ram-bytes" :class="{ on: isPurchTypeBytes }">
                        <button type="button" class="btn small" :disabled="!isPurchTypeBytes"
                                @click="addQuantity(1024)">
                            <span>1KB</span>
                        </button>
                        <button type="button" class="btn small" :disabled="!isPurchTypeBytes"
                                @click="addQuantity(10240)">
                            <span>10KB</span>
                        </button>
                        <button type="button" class="btn small" :disabled="!isPurchTypeBytes"
                                @click="addQuantity(102400)">
                            <span>100KB</span>
                        </button>
                        <button type="button" class="btn small" :disabled="!isPurchTypeBytes"
                                @click="addQuantity(1048576)">
                            <span>1MB</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="ram-submit">
            <button type="button" class="btn submit" @click="openRam">
                <span>{{isSell ? $t('ram').sell : $t('ram').buy }}</span>
            </button>
        </div>


        <modal v-model="isRAM">
            <div>
                <h6 v-html="$t('ram').accountRecipient">Recipient Account</h6>
                <p> {{isSell ? account.name : ram.receiver}} </p>

                <h6 v-html="$t('ram').amount">Amount</h6>
                <p> {{ ram.quantity }} {{ isPurchTypeBytes ? 'Bytes' : mainSymbol }} </p>
            </div>

            <ul class="col-row col-l-r modal-transfer__submit">
                <li class="col-1-2">
                    <button type="button" @click="closeRam" class="btn submit cancel">
                        <span>{{ $t('button').cancel }}</span>
                    </button>
                </li>
                <li class="col-1-2">
                    <button type="button" @click.prevent="runRam"
                            class="btn submit danger">
                        <span>{{ $t('button').accept }}</span>
                    </button>
                </li>
            </ul>
        </modal>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import modal from '../../../common/components/modal/modal.component.vue';
    import { EventBus } from '../../../common/services/vue-event-bus.service';
    import { mapGetters } from 'vuex';

    @Component({
        computed: {
            ...mapGetters([
                'account',
            ]),
        },
        components: {
            modal,
        },
    })
    export default class Ram extends Vue {
        isSell: boolean = false; // false = buy, true = sell
        isPurchTypeBytes: boolean = false; // false = EOS, true = bytes
        isRAM: boolean = false;
        isCopied: boolean = false;
        transactionId: string = '';
        error: string = '';
        ram: any = {
            quantity: '',
            receiver: '',
        };
        mainSymbol: string = this.$store.getters.account.mainSymbol;

        created() {
            this.getPossibleBalance();
        }

        mounted() {
            this.focus('receiver');
            EventBus.$on('closeErrorModal', () => {
                this.closeModalFail();
            });
        }

        getPossibleBalance() {
            this.$store.dispatch('getPossibleBalance',
                {symbol: this.mainSymbol, contractName: 'eosio.token'});
        }

        addQuantity(bytes: number) {
            const quantity = Number(this.ram.quantity) + bytes;
            if (this.isSell && quantity > this.myRam) {
                this.ram.quantity = this.myRam;
            } else {
                this.ram.quantity = quantity;
            }
            this.focus('quantity');
        }

        openRam() {
            this.error = '';
            const ram = this.ram;
            const isSell = this.isSell;
            if (!isSell && !ram.receiver) {
                this.error = 'recipientAccountRequired';
            } else if (!ram.quantity) {
                if (!this.isPurchTypeBytes) {
                    this.error = 'checkEosQuantity';
                } else {
                    this.error = 'checkRamQuantity';
                }
            } else if (isSell && this.myRam < ram.quantity) {
                this.error = 'errorSellRamQuantity';
            } else if (!isSell && !this.isPurchTypeBytes
                && this.$store.getters.possibleBalance < ram.quantity) {
                this.error = 'errorBuyRamQuantity';
            }

            if (this.error) {
                this.$store.dispatch('setErrorModal',
                    {error: this.$i18n.t(`ram.${this.error}`, {symbol: this.mainSymbol})});
                return;
            }

            this.isRAM = true;
        }

        closeRam() {
            this.isRAM = false;
        }

        async runRam() {
            this.isCopied = false;
            this.transactionId = '';
            try {
                if (this.isSell) {
                    await this.$store.dispatch('sellRam', this.ram);
                } else {
                    if (this.isPurchTypeBytes) {
                        await this.$store.dispatch('buyRamBytes', this.ram);
                    } else {
                        await this.$store.dispatch('buyRam', this.ram);
                    }
                }
                this.getPossibleBalance();
                this.isRAM = false;
                this.transactionId = this.$store.getters.ramTransactionId;
            } catch (e) {
                this.isRAM = false;
                const error = this.$i18n.t('ram.fail');
                try {
                    this.$store.dispatch('setErrorModal', {error, detail: JSON.parse(e).error.details[0].message});
                } catch (e) {
                    this.$store.dispatch('setErrorModal', {error});
                }
            }
        }

        transactionIdCopy() {
            const t: any = document.createElement('textarea');
            document.body.appendChild(t);
            t.value = this.$store.getters.ramTransactionId;
            t.select();
            document.execCommand('copy');
            document.body.removeChild(t);
            this.isCopied = true;
        }

        closeModalSuccess() {
            this.transactionId = '';
        }

        closeModalFail() {
            const error = this.error;
            if (error === 'recipientAccountRequired') {
                this.focus('receiver');
            } else if (error === 'checkEosQuantity' || error === 'checkRamQuantity'
                || error === 'errorSellRamQuantity' || error === 'errorBuyRamQuantity') {
                this.focus('quantity');
            }
        }

        focus(id: string) {
            const el = document.getElementById(id);
            if (el) {
                el.focus();
            }
        }

        get myRam() {
            const ram = this.$store.getters.account.resource.ram;
            return ram.max - ram.used;
        }

        @Watch('isSell')
        changeIsSell(val: boolean) {
            if (val) {
                this.focus('quantity');
            } else {
                setTimeout(() => this.focus('receiver'));
            }
            this.ram.quantity = '';
            this.ram.receiver = '';
        }
    }
</script>
