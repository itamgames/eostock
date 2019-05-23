<template>
    <section class="home" v-if="account.name">
        <div class="my-eos">
            <!-- 나의 EOS -->
            <div class="pannel">
                <h6>{{ $t('main.titleMySymbol', {symbol: account.mainSymbol})}}</h6>
                <div class="eos">
                    <div class="eos-coin">
                        <span class="eos-coin__integer">{{ eos.first | comma }}</span>
                        <span class="eos-coin__decimal" v-if="eos.second">.{{ eos.second }}</span>
                    </div>
                    <div class="eos-dollar">
                        $ {{(account.balance.price * account.balance.total.eos) | comma}}
                    </div>
                </div>

                <div class="eos-progress">
                    <progress-bar :staked="account.balance.staked.rate"
                                  :unstaked="account.balance.unstaked.rate">
                    </progress-bar>
                </div>
                <div class="col-row eos-progress-data">
                    <div class="col-1-3">
                        <span class="dot staked"></span>
                        <span>{{ $t('main').staked }}</span>
                        <div class="eos-state">
                            {{ account.balance.staked.eos | comma}}
                        </div>
                    </div>
                    <div class="col-1-3">
                        <span class="dot unstaked"></span>
                        <span>{{ $t('main').unstaked }}</span>
                        <div class="eos-state">
                            {{ account.balance.unstaked.eos | comma}}
                        </div>
                    </div>
                    <div class="col-1-3">
                        <span class="dot refund"></span>
                        <span>{{ $t('main').refund }}</span>
                        <div class="eos-state">
                            {{ account.balance.refund.eos | comma}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="tokens">
            <h6 class="h-gap-15 align-left">{{ $t('main').titleMyToken }}</h6>
            <div class="pannel tokens-view">
                <div class="list-box">
                    <ul>
                        <li>
                            <span class="title">{{account.mainSymbol}}</span>
                            <span class="token">{{account.balance.total.eos | comma}}</span>
                        </li>
                        <li v-for="(toke, index) of customTokens" :key="index">
                            <span class="title">{{toke.symbol}}</span>
                            <span class="token">{{toke.balance | comma}}</span>
                        </li>
                        <li v-if="customTokens.length % 2 === 0"></li>
                    </ul>
                </div>
            </div>

        </div>
        <div class="resource">
            <h6 class="h-gap-15 align-left">{{ $t('main').titleMyResource }}</h6>
            <div class="col-row bar">
                <div class="col-1-3">
                    <h6>{{ $t('main').memory }}</h6>
                    <progress-V-Bar :barHeight="account.resource.ram.rate"
                                    :barData="account.resource.ram.used | byte | comma"
                                    :barMax="account.resource.ram.max | byte | comma">
                    </progress-V-Bar>
                </div>
                <div class="col-1-3">
                    <h6>{{ $t('main').cpu }}</h6>
                    <progress-V-Bar :barHeight="account.resource.cpu.rate"
                                    :barData="account.resource.cpu.used | us | comma(2)"
                                    :barMax="account.resource.cpu.max | us | comma(2)"
                                    :barEtc="account.resource.cpu.eos | comma">
                    </progress-V-Bar>
                </div>
                <div class="col-1-3">
                    <h6>{{ $t('main').bandwidth }}</h6>
                    <progress-V-Bar :barHeight="account.resource.bandwidth.rate"
                                    :barData="account.resource.bandwidth.used | byte | comma(2)"
                                    :barMax="account.resource.bandwidth.max | byte | comma(2)"
                                    :barEtc="account.resource.bandwidth.eos | comma">
                    </progress-V-Bar>
                </div>
            </div>
        </div>
        <div class="DH15"></div>
        <ul class="col-row h-gap-15 col-l-r">
            <li class="col-1-2">
                <button @click="$router.push('/transfer')" type="button" class="btn submit">
                    <span>{{ $t('main').btnTransfer }}</span>
                </button>
            </li>
            <li class="col-1-2">
                <button @click="goHistory" type="button" class="btn submit">
                    <span>{{ $t('main').btnHistory }}</span>
                </button>
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import progressBar from '../../../common/components/progress-bar/progress-bar.component.vue';
    import progressVBar from '../../../common/components/progress-bar/progress-v-bar.component.vue';
    import { goBlockExplorerUser } from '../../../common/utils/block-explorer.utils';
    import { mapGetters } from 'vuex';

    @Component({
        computed: {
            ...mapGetters([
                'account',
                'customTokens',
            ]),
        },
        components: {
            progressBar,
            progressVBar,
        },
    })
    export default class Home extends Vue {
        goHistory() {
            const account = this.$store.getters.account;
            const isGo = goBlockExplorerUser(account.network.name, account.name);
            if (!isGo) {
                this.$store.dispatch('setErrorModal', {error: this.$i18n.t(`error.notSupportHistory`)});
            }
        }

        get eos() {
            return {
                first: Number(this.$store.getters.account.balance.total.eos.toString().split('.')[0]),
                second: this.$store.getters.account.balance.total.eos.toString().split('.')[1],
            };
        }
    }
</script>

