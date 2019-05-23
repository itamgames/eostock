<template>
    <div class="create-account">
        <div class="radio-group-tab">
            <ul>
                <li>
                    <input type="radio" id="issue" :value="true" v-model="isIssue" name="checkIssue"/>
                    <label for="issue">
                        <span>{{$t('issueToken.issue')}}</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="incinerate" :value="false" v-model="isIssue" name="checkIssue"/>
                    <label for="incinerate">
                        <span>{{$t('issueToken.burn')}}</span>
                    </label>
                </li>
            </ul>
        </div>
        <div class="DH15"></div>
        <div v-if="isIssue">
            <div class="pannel">
                <form>
                    <div class="align-left m-b-5">
                        <h6>{{ $t('issueToken.symbol') }}</h6>
                        <input type="text" class="block-input small uppercase" :placeholder="$t('issueToken.symbol')"
                               v-only-english v-model="token.symbol" maxlength="7"/>
                    </div>
                    <div class="align-left m-b-5">
                        <h6>{{ $t('issueToken.maxSupply') }}</h6>
                        <input type="number" class="block-input small" :placeholder="$t('issueToken.maxSupply')"
                               v-model="token.maxSupply"/>
                    </div>
                    <div class="align-left">
                        <h6>{{ $t('issueToken.memo') }}</h6>
                        <textarea v-model="token.memo" :placeholder="$t('issueToken.memo')" class="textarea"></textarea>
                    </div>
                </form>
            </div>
            <div class="submit-box">
                <button type="button" class="btn submit "
                        @click="deployContract">
                    <span v-html="$t('issueToken.issueToken')">토큰 발행</span>
                </button>
            </div>
        </div>
        <div v-else>
            <div class="pannel">
                <div v-if="!hasBurn" v-html="$t('issueToken.errorHasBurn')"></div>
                <div v-else>
                    <form @submit.prevent="burn">
                        <div class="align-left m-b-5">
                            <h6>{{ $t('issueToken.symbol') }}</h6>
                            <div class="select">
                                <button type="button" class="select-selected"
                                        :class="{ on: isOpenSymbol }"
                                        @click="isOpenSymbol = !isOpenSymbol">
                                    {{ selectedSymbol.symbol }}
                                    <i class="icon-arrow-down"></i>
                                </button>
                                <dropdown v-model="isOpenSymbol" :autoCloseOut="true">
                                    <ul class="select-list on">
                                        <li v-for="(item, key) in burnSymbols" :key="key">
                                            <button type="button"
                                                    class="btn select"
                                                    :class="{ on: item.symbol === selectedSymbol.symbol }"
                                                    @click="symbolSelect( item )">
                                                <span>{{ item.symbol }}</span>
                                            </button>
                                        </li>
                                    </ul>
                                </dropdown>
                            </div>
                        </div>
                        <div class="align-left m-b-5">
                            <h6>{{$t('issueToken.burnQuantity')}} ({{selectedSymbol.asset ? selectedSymbol.asset : 0}})</h6>
                            <input type="number" class="block-input small uppercase"
                                   v-model="burnInfo.quantity"
                                   :placeholder="$t('issueToken.burnQuantity')"/>
                        </div>
                    </form>
                </div>
            </div>
            <div class="submit-box" v-if="hasBurn">
                <button type="submit" @click="burn" class="btn submit ">
                    <span>{{$t('button.pushTransaction')}}</span>
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { mapGetters } from 'vuex';
    import dropdown from '@/common/components/dropdown/dropdown.component.vue';

    @Component({
        computed: {
            ...mapGetters([
                'account',
                'burnSymbols',
                'hasBurn',
            ]),
        },
        components: {
            dropdown,
        },
    })
    export default class IssueToken extends Vue {
        isIssue: boolean = true;
        isOpenSymbol: boolean = false;
        selectedSymbol: any = {};
        token: any = {
            symbol: '',
            maxSupply: null,
            memo: '',
        };
        burnInfo: any = {
            quantity: '',
        };

        deployContract() {
            const token = this.token;
            if (!token.symbol || !token.maxSupply) {
                this.$store.dispatch('setErrorModal', {error: this.$i18n.t('error.required')});
                return;
            }
            this.$store.dispatch('issueToken', this.token);
        }

        async burn() {
            const burnInfo = this.burnInfo;
            if (!this.$store.getters.hasBurn) {
                this.$store.dispatch('setErrorModal', {error: this.$i18n.t('issueToken.errorHasBurn')});
                return;
            }
            if (!burnInfo.quantity) {
                this.$store.dispatch('setErrorModal', {error: this.$i18n.t('error.required')});
                return;
            }

            burnInfo.symbol = this.selectedSymbol.symbol;
            await this.$store.dispatch('burn', burnInfo);
            this.selectedSymbol =
                await this.$store.dispatch('getMyContractToken', this.selectedSymbol.symbol);
        }

        symbolSelect(symbol: string) {
            this.selectedSymbol = symbol;
            this.isOpenSymbol = false;
        }

        async initBurn() {
            if (!this.isIssue) {
                await this.$store.dispatch('getContract');
                const burnSymbol = this.$store.getters.burnSymbols[0];
                this.selectedSymbol = burnSymbol ? burnSymbol : {};
            }
        }

        @Watch('isIssue')
        changeTab() {
            this.initBurn();
        }
    }
</script>
