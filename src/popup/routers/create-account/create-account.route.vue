<template>
    <div class="create-account">
        <div class="DH15"></div>
        <div class="pannel">
            <div class="create-account-head">
                <h4 v-html="$t('cAccount').title">Create Account</h4>
                <a href="https://itam.gitbook.io/eostock-guide/eostock-eos-account" target="_blank" class="create-account-guide">
                    <img alt="" src="../../assets/ico-question-c.svg" />
                    <span v-html="$t('cAccount').guide">Guide</span></a>
            </div>
            <form>
                <div>
                    <input type="text" class="block-input small" :placeholder="$t('cAccount').accountName"
                           v-model="createFormAry.accountName"/>
                </div>
                <div>
                    <input type="text" class="block-input small" :placeholder="$t('cAccount').ownerPublicKey"
                           v-model="createFormAry.ownerPublicKey"/>
                </div>
                <div>
                    <input type="text" class="block-input small" :placeholder="$t('cAccount').activeKey"
                           v-model="createFormAry.activePublicKey"/>
                </div>
                <div class="col-row gap-1-2 cpu-box">
                    <div class="DH25"></div>
                    <div class="col-1-2">
                        <h6 class="align-left" v-html="$t('main').cpu">CPU</h6>
                        <div class="block-input small">
                            <input type="text" class="input-trans" placeholder="0" v-model="createFormAry.cpu"/>
                            <span class="unit">{{account.mainSymbol}}</span>
                        </div>
                    </div>
                    <div class="col-1-2">
                        <h6 class="align-left" v-html="$t('main').bandwidth">Bandwidth</h6>
                        <div class="block-input small">
                            <input type="text" class="input-trans" placeholder="0" v-model="createFormAry.bandwidth"/>
                            <span class="unit">{{account.mainSymbol}}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="radio-group">
                        <input type="radio" id="delegate" name="stake" value="0" v-model="createFormAry.stake"/>
                        <label for="delegate">
                            <span v-html="$t('stake').delegate">Delegate</span>
                        </label>

                        <input type="radio" id="transfer" name="stake" value="1" v-model="createFormAry.stake"/>
                        <label for="transfer">
                            <span v-html="$t('stake').trnsfer">Transfer</span>
                        </label>
                    </div>
                </div>
                <div class="byte-box">
                    <div class="DH15"></div>
                    <h6 class="align-left">RAM</h6>
                    <div class="block-input small row">
                        <input type="text" class="input-trans" placeholder="0" v-model="createFormAry.ram"/>
                        <span class="unit">{{ createFormAry.ramUnit }}</span>
                    </div>
                    <div class="DH5"></div>
                    <div class="row">
                        <div class="float-left inline-block radio-group">
                            <input type="radio" id="eos" name="unit" :value="mainSymbol"
                                   v-model="createFormAry.ramUnit"
                                   :checked="createFormAry.ramUnit === mainSymbol"
                            />
                            <label for="eos">
                                <span>{{mainSymbol}}</span>
                            </label>

                            <input type="radio" id="byte" name="unit" value="Byte"
                                   v-model="createFormAry.ramUnit"
                                   :checked="createFormAry.ramUnit === 'Byte'"/>
                            <label for="byte">
                                <span>Byte</span>
                            </label>
                        </div>
                        <div class="float-right inline-block btn-box">
                            <button type="button" class="btn submit tin"
                                    @click="addRam(1024)"
                                    :disabled="createFormAry.ramUnit === mainSymbol">
                                <span>1KB</span>
                            </button>
                            <button type="button" class="btn submit tin"
                                    @click="addRam(10240)"
                                    :disabled="createFormAry.ramUnit === mainSymbol">
                                <span>10KB</span>
                            </button>
                            <button type="button" class="btn submit tin"
                                    @click="addRam(102400)"
                                    :disabled="createFormAry.ramUnit === mainSymbol">
                                <span>100KB</span>
                            </button>
                            <button type="button" class="btn submit tin"
                                    @click="addRam(1048576)"
                                    :disabled="createFormAry.ramUnit === mainSymbol">
                                <span>1MB</span>
                            </button>
                        </div>
                    </div>
                    <div class="clear"></div>
                    <div class="DH15"></div>
                    <p class="msg" v-html="$t('cAccount.warnning', {symbol: account.mainSymbol})">
                        {symbol}계정의 원활한 사용을 위해서 CPU와 Bandwidth에는 0.1 {symbol} 이상,
                        RAM에는 4KB 이상 Stake하시길 권장합니다.</p>
                </div>
            </form>
        </div>
        <div class="submit-box">
            <button type="button" class="btn submit "
                    @click="createAccount()">
                <span>Create</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { mapGetters } from 'vuex';

    @Component({
        computed: {
            ...mapGetters([
                'account',
            ]),
        },
    })
    export default class CreateAccount extends Vue {
        mainSymbol: string = this.$store.getters.account.mainSymbol;
        createFormAry: any = {
            accountName: '',
            ownerPublicKey: '',
            activePublicKey: '',
            cpu: '',
            bandwidth: '',
            stake: 0,
            ram: '',
            ramUnit: this.mainSymbol,
        };

        addRam(byte: number) {
            this.createFormAry.ram = Number(this.createFormAry.ram) + Number(byte);
        }

        async createAccount() {
            const createForm = this.createFormAry;
            let error = '';
            if (!createForm.accountName) {
                error = 'accountNameRequired';
            } else if (!createForm.ownerPublicKey) {
                error = 'ownerPublicKeyRequired';
            } else if (!createForm.activePublicKey) {
                error = 'activePublicKeyRequired';
            }

            if (error) {
                this.$store.dispatch('setErrorModal', {error: this.$i18n.t(`cAccount.${error}`)});
                return;
            }

            const symbol = this.mainSymbol;
            const newAccount: any = {
                accountName: createForm.accountName,
                ownerKey: createForm.ownerPublicKey,
                activeKey: createForm.activePublicKey,
                cpu: createForm.cpu ? `${Number(createForm.cpu).toFixed(4)} ${symbol}` : `0.0000 ${symbol}`,
                net: createForm.bandwidth ? `${Number(createForm.bandwidth).toFixed(4)} ${symbol}` : `0.0000 ${symbol}`,
                transfer: Number(createForm.stake),
            };

            if (createForm.ramUnit === symbol) {
                newAccount.quant = `${Number(createForm.ram).toFixed(4)} ${symbol}`;
            } else {
                newAccount.bytes = Number(createForm.ram);
            }

            await this.$store.dispatch('createAccount', newAccount);
        }

    }
</script>
