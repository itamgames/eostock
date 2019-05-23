<template>
    <header v-if="enable && account.name">
        <div class="header">
            <div class="header-account" :class="{ on: isOpenAccounts }">
                <div class="header-account__group">
                    {{account.network.name ? account.network.name.charAt(0).toUpperCase() +
                    account.network.name.slice(1) : '-'}}
                </div>
                <div class="header-account__name">
                    <button type="button" @click="toggleAccounts" class="btn btn-account trans">
                        <span class="accont">{{nowAccountName}}</span>
                        <i class="icon-arrow-down"></i>
                    </button>
                    <button type="button" @click="copy" class="btn btn-copy small">
                        <span>copy</span>
                    </button>
                </div>
            </div>
            <!-- choose wallet -->
            <dropdown v-model="isOpenAccounts" :autoCloseOut="true">
                <div class="open-account">
                    <div class="list-box">
                        <ul>
                            <li v-for="(_accounts, network) in accountList">
                                <span class="title">{{ network }}</span>
                                <div v-for="_account in _accounts"
                                     class="list-account"
                                     :class="{ on: checkAccount(account, _account)}">
                                    <button type="button"
                                            class="btn trans js-account"
                                            @click="selectAccount(_account)">
                                        <span>{{ _account.name }}</span>
                                    </button>
                                    <button type="button" class="btn btn-del"
                                            v-if="!checkAccount(account, _account)"
                                            @click="deleteAccount(_account)">
                                        <span><i class="icon icon-del"></i></span>
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <button type="button" class="btn js-add" @click.prevent="addAccount">
                        <span>+ Add Account</span>
                    </button>
                </div>
            </dropdown>
            <div class="header-routers" :class="{ on: isOpenMenu }">
                <button type="button" v-show="!isOpenMenu" @click="$router.push('/')" class="btn trans js-home">
                    <span><i class="icon icon-home"></i></span>
                </button>
                <button type="button" class="btn trans js-memu" @click.prevent="openMenu">
                    <span><i class="icon-menu"></i></span>
                </button>
            </div>
            <!-- site link -->
            <dropdown v-model="isOpenMenu">
                <div class="open-routers">
                    <ul class="menu-list">
                        <li>
                            <router-link to="/transfer" class="link">
                                <span>Transfer</span> <i class="icon-arrow-right"></i>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/stake" class="link">
                                <span>Stake</span> <i class="icon-arrow-right"></i>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/ram" class="link">
                                <span>RAM</span> <i class="icon-arrow-right"></i>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/contract" class="link">
                                <span>Contract</span> <i class="icon-arrow-right"></i>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/issue-token" class="link">
                                <span>Issue Token</span> <i class="icon-arrow-right"></i>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/account" class="link">
                                <span>Create Account</span> <i class="icon-arrow-right"></i>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/setting" class="link">
                                <span>Setting</span>
                                <i class="icon-arrow-right"></i>
                            </router-link>
                        </li>
                        <li>
                            <a @click="lock" class="link">
                                <span>Lock</span>
                                <i class="icon-arrow-right"></i>
                            </a>
                        </li>
                        <li>
                            <a @click="createItamStoreTab" class="link">
                                <span>ITAM STORE</span>
                                <i class="icon-arrow-right"></i>
                            </a>
                        </li>
                    </ul>
                    <div class="open-routers-logo">
                        <img alt="ITAM NETWORK" src="../assets/logo-itam.svg"/>
                    </div>
                </div>
            </dropdown>
        </div>
    </header>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import dropdown from '../../common/components/dropdown/dropdown.component.vue';
    import { Account } from '../store/modules/account/account.interface';
    import { getHash } from '../../common/utils/crypto.utils';
    import { mapGetters } from 'vuex';
    import { EventBus } from '../../common/services/vue-event-bus.service';

    @Component({
        computed: {
            ...mapGetters([
                'nowAccountName',
                'account',
            ]),
        },
        components: {
            dropdown,
        },
    })
    export default class HeaderLayout extends Vue {
        enable: boolean = true;
        isOpenAccounts: boolean = false;
        isOpenMenu: boolean = false;
        accountList: any = {};

        created() {
            this.getAccountList();
            this.enable = !this.$route.meta.notHeader;
        }

        toggleAccounts() {
            this.isOpenAccounts = !this.isOpenAccounts;
            this.isOpenMenu = false;
        }

        openMenu() {
            this.isOpenMenu = true;
            this.isOpenAccounts = false;
        }

        addAccount() {
            this.$router.push('/add-account');
        }

        copy() {
            const t: any = document.createElement('textarea');
            document.body.appendChild(t);
            t.value = this.$store.getters.nowAccountName;
            t.select();
            document.execCommand('copy');
            document.body.removeChild(t);
            EventBus.$emit('toast', 'copied');
        }

        selectAccount(account: Account) {
            const nowAccount = this.$store.getters.account;
            if (!(account.network.name === nowAccount.network.name
                && account.name === nowAccount.name)) {
                this.$store.dispatch('changeAccount', account);
            }
            this.isOpenAccounts = false;
        }

        async deleteAccount(account: Account) {
            if (this.$store.getters.accounts.length > 1) {
                await this.$store.dispatch('removeAccount', account);
            }
        }

        async lock() {
            await this.$store.dispatch('lock');
            this.$router.replace('/sign/in');
        }

        async backup() {
            const download: any = document.createElement('a');
            download.download = getHash() + '.txt';
            download.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.$store.getters.encryptWallet);
            download.click();
        }

        get checkAccount() {
            return (account: Account, checkAccount: Account) =>
                account.name === checkAccount.name && account.network.name === checkAccount.network.name;
        }

        createItamStoreTab() {
            chrome.tabs.create({url: 'https://itam.store/'});
        }

        @Watch('$store.getters.wallet')
        getAccountList() {
            this.accountList = {};
            this.$store.getters.accounts.forEach((account: any) => {
                const network = account.network.name;
                if (!this.accountList[network]) {
                    this.accountList[network] = [];
                }
                this.accountList[network].push(account);
            });
        }

        @Watch('$route')
        onRouteChanged(val: any) {
            this.enable = !val.meta.notHeader;
            this.isOpenAccounts = false;
            this.isOpenMenu = false;
        }
    }
</script>
