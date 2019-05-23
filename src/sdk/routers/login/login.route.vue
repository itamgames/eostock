<template>
    <div class="account">
        <div class="account-body">
            <div ref="accountBox" class="account-body__box">
                <div class="cell">
                    <h5>{{ $t('signUp').step3Title }}</h5>
                    <div v-if="accounts.length > 0 && Object.keys(accountList).length > 0"
                         class="open-account">
                        <div class="list-box">
                            <ul>
                                <li v-for="(_accounts, network) in accountList">
                                    <span class="title">{{ network | capitalize }}</span>
                                    <div v-for="_account in _accounts">
                                        <button @click.prevent="selectAccount(_account)" class="btn"
                                                :class="{ on: _account.ssoToken  === ssoToken }">
                                            <span>{{ _account.name }}</span>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <ul class="col-row col-l-r">
                            <li class="col-1-2">
                                <button type="button" class="btn submit" @click="close">
                                    <span>{{ $t('button').close }}</span>
                                </button>
                            </li>
                            <li class="col-1-2">
                                <button type="button" class="btn submit" @click="response">
                                    <span>{{ $t('button').ok }}</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <sign-up></sign-up>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { mapGetters } from 'vuex';
    import { Account } from '../../store/modules/wallet/wallet.interface';
    import signUp from '../../components/sign-up/sign-up.component.vue';

    const request = (window as any).data.payload;

    @Component({
        computed: {
            ...mapGetters([
                'accounts',
            ]),
        },
        components: {
            signUp,
        },
    })
    export default class SelectIdentity extends Vue {
        ssoToken: string = '';
        account: string = '';
        accountList: any = {};

        created() {
            this.getAccountList();
        }

        selectAccount(account: Account) {
            this.account = account.name;
            this.ssoToken = account.ssoToken;
        }

        response() {
            if (this.ssoToken) {
                this.$store.dispatch('response', {ssoToken: this.ssoToken, account: this.account});
            }
        }

        close() {
            self.close();
        }

        getAccountList() {
            this.accountList = {};
            const chainIds: any = {};
            for (const network of request.payload.networks) {
                chainIds[network.chainId] = true;
            }

            let index = 0;
            this.$store.getters.accounts.forEach((account: any) => {
                const {name, chainId} = account.network;

                if (chainIds[chainId]) {
                    if (!this.accountList[name]) {
                        this.accountList[name] = [];
                    }
                    this.accountList[name].push(account);

                    if (index === 0) {
                        this.ssoToken = account.ssoToken;
                        this.account = account.name;
                        index++;
                    }
                }
            });
        }
    }
</script>
