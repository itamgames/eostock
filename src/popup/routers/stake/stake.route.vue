<template>
    <div class="stake transfer">
        <div class="radio-group-tab">
            <ul>
                <li class="col-1-3">
                    <input type="radio" id="stake" value="stake" v-model="checkStake" name="checkStake" checked/>
                    <label for="stake">
                        <span v-html="$t('stake').stake">STAKE</span>
                    </label>
                </li>
                <li class="col-1-3">
                    <input type="radio" id="unstake" value="unstake" v-model="checkStake" name="checkStake"/>
                    <label for="unstake">
                        <span v-html="$t('stake').unStake">UNSTAKE</span>
                    </label>
                </li>
                <li class="col-1-3">
                    <input type="radio" id="refund" value="refund" v-model="checkStake" name="checkStake"/>
                    <label for="refund">
                        <span>REFUND</span>
                    </label>
                </li>
            </ul>
        </div>

        <div v-if="checkStake === 'stake' || checkStake === 'unstake'">
            <div class="send">
                <div v-if="!isUnstake" class="send-box">
                    <div class="send-box__sender">
                        <h6 class="align-left" v-html="$t('stake').accountOwner">Stake Owner</h6>
                        <div class="account-sender">
                            {{account.name}}<br />
                            <small>( {{account.balance.total.eos | comma}} {{account.mainSymbol}})</small>
                        </div>
                    </div>
                    <div class="send-box__img">
                        <img alt="" src="../../assets/send-box-mid.png"/>
                    </div>
                    <div class="send-box__recip">
                        <h6 class="align-left" v-html="$t('stake').accountRecipient">Recipient Account</h6>
                        <input type="text" class="account-recip" maxlength="12" id="stakeReceiver"
                               v-model="stake.receiver"
                               placeholder="receiver"/>
                    </div>
                </div>

                <div v-if="isUnstake" class="send-box">
                    <div class="send-box__recip">
                        <h6 class="align-left" v-html="$t('stake').accountHolder">Holder Account</h6>
                        <input type="text" class="account-recip" maxlength="12" id="unstakeReceiver"
                               v-model="stake.receiver"
                               placeholder="receiver"/>
                    </div>
                    <div class="send-box__img">
                        <img alt="" src="../../assets/send-box-mid-re.svg"/>
                    </div>
                    <div class="send-box__sender">
                        <h6 class="align-left" v-html="$t('stake').accountOwner">Stake Owner</h6>
                        <div class="account-sender">
                            {{account.name}}
                        </div>
                    </div>
                </div>
            </div>

            <div class="stake-eos pannel">
                <div class="stake-box">
                    <h4>CPU</h4>
                    <p>
                        <input type="number" v-model="stake.cpuQuantity" placeholder="cpuQuantity" id="cpu"/>
                        {{account.mainSymbol}}
                    </p>
                    <div class="DH15"></div>
                    <h4>Bandwidth</h4>
                    <p>
                        <input type="number" v-model="stake.netQuantity" placeholder="netQuantity"/>
                        {{account.mainSymbol}}
                    </p>
                </div>

                <div v-if="!isUnstake" class="radio-group">
                    <div class="DH15"></div>

                    <input type="radio" id="delegate" :value="false" v-model="stake.transfer" name="isTransfer"/>
                    <label for="delegate">
                        <span v-html="$t('stake').delegate">Delegate</span>
                    </label>

                    <input type="radio" id="transfer" :value="true" v-model="stake.transfer" name="isTransfer"/>
                    <label for="transfer">
                        <span v-html="$t('stake').trnsfer">Transfer</span>
                    </label>
                </div>
            </div>

            <div class="stake-submit">
                <button type="button" class="btn submit" @click="openStake">
                    <span>{{isUnstake ? 'UnStake' : 'Stake'}}</span><br>
                    <span v-if="!isUnstake"
                          class="small">({{stake.transfer ? $t('stake').trnsfer : $t('stake').delegate }})</span>
                </button>
            </div>
        </div>

        <div v-else class="backup export">
            <div class="pannel">
                <h3>Refund</h3>
                <p class="script" v-html="$t('refund.script', {symbol: account.mainSymbol})"></p>
                <button type="button" @click="refund" class="btn submit">
                    <span>Refund</span>
                </button>
            </div>
        </div>

        <modal v-model="isStake">
            <h6>{{isUnstake ? 'Holder Account' : 'Stake Owner'}}</h6>
            <p> {{stake.receiver}} </p>

            <h6>CPU</h6>
            <p> {{stake.cpuQuantity}} {{account.mainSymbol}} </p>

            <h6>Bandwidth</h6>
            <p> {{stake.netQuantity}} {{account.mainSymbol}} </p>

            <div class="delegate-type" v-if="!isUnstake">{{stake.transfer ? 'Transfer' : 'Delegate' }}</div>

            <ul class="col-row col-l-r modal-transfer__submit">
                <li class="col-1-2">
                    <button type="button" @click="closeStake" class="btn submit cancel">
                        <span>{{ $t('button').cancel }}</span>
                    </button>
                </li>
                <li class="col-1-2">
                    <button type="button" @click.prevent="runStake"
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
    import modal from '@/common/components/modal/modal.component.vue';
    import { EventBus } from '@/common/services/vue-event-bus.service';
    import { mapGetters } from 'vuex';

    @Component({
        computed: {
            ...mapGetters([
                'account',
                'possibleBalance',
            ]),
        },
        components: {
            modal,
        },
    })
    export default class Stake extends Vue {
        isUnstake: boolean = false;
        checkStake: string = 'stake';
        error: string = '';
        isCopied: boolean = false;
        isStake: boolean = false;
        stake: any = {
            receiver: '',
            netQuantity: '',
            cpuQuantity: '',
            transfer: false,
        };

        created() {
            this.getPossibleBalance();
        }

        mounted() {
            this.focus('stakeReceiver');
            EventBus.$on('closeErrorModal', () => {
                this.closeModalFail();
            });
        }

        async runStake() {
            this.isCopied = false;
            try {
                if (this.isUnstake) {
                    await this.$store.dispatch('unstake', this.stake);
                } else {
                    await this.$store.dispatch('stake', this.stake);
                }
                this.getPossibleBalance();
                this.isStake = false;
            } catch (e) {
                this.isStake = false;
                const error = this.$i18n.t('stake.fail');
                try {
                    this.$store.dispatch('setErrorModal', {error, detail: JSON.parse(e).error.details[0].message});
                } catch (e) {
                    this.$store.dispatch('setErrorModal', {error});
                }
            }
        }

        getPossibleBalance() {
            this.$store.dispatch('getPossibleBalance',
                {symbol: this.$store.getters.account.mainSymbol, contractName: 'eosio.token'});
        }

        openStake() {
            this.error = '';
            const stake = this.stake;
            const quantity = Number(stake.cpuQuantity) + Number(stake.netQuantity);
            if (!stake.receiver) {
                if (!this.isUnstake) {
                    this.error = 'recipientAccountRequired';
                } else {
                    this.error = 'holderAccountRequired';
                }
            } else if (!stake.cpuQuantity && !stake.netQuantity) {
                this.error = 'checkQuantity';
            } else if (!this.isUnstake && this.$store.getters.possibleBalance < quantity) {
                this.error = 'errorStakeQuantity';
            }

            if (this.error) {
                this.$store.dispatch('setErrorModal', {error: this.$i18n.t(`stake.${this.error}`)});
                return;
            }

            this.isStake = true;
        }

        closeStake() {
            this.isStake = false;
        }

        closeModalFail() {
            const error = this.error;
            this.error = '';
            if (error === 'recipientAccountRequired') {
                this.focus('stakeReceiver');
            } else if (error === 'holderAccountRequired') {
                this.focus('unstakeReceiver');
            } else if (error === 'checkQuantity' || error === 'errorStakeQuantity') {
                this.focus('cpu');
            }
        }

        focus(id: string) {
            const el = document.getElementById(id);
            if (el) {
                el.focus();
            }
        }

        refund() {
            this.$store.dispatch('refund');
        }

        @Watch('checkStake')
        changeIsUnstake(val: string) {
            if (val === 'unstake') {
                this.isUnstake = true;
                this.focus('unstakeReceiver');
            } else if (val === 'stake') {
                this.isUnstake = false;
                this.focus('stakeReceiver');
            }
            this.stake = {
                receiver: '',
                netQuantity: '',
                cpuQuantity: '',
                transfer: false,
            };
        }
    }
</script>
