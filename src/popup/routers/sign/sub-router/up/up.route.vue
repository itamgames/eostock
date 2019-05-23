<template>
    <div class="sign">
        <div class="gap-h"></div>
        <div class="sign-head">
            <div class="sign-head__logo">
                <img alt="Itam Games" src="../../../../assets/logo-sign.svg"/>
            </div>
            <p v-html="$t('signUp').script" :class="$i18n.locale"></p>
        </div>
        <div class="sign-body">
            <div ref="signBox" class="sign-body__box" :style="{ left: gap+'px' }">
                <create-password @createPassword="createPassword"></create-password>
                <import-private-key @importPrivateKey="importPrivateKey"></import-private-key>
                <select-account @createWallet="createWallet" @back="back"></select-account>
            </div>
        </div>
        <div class="sign-foot">
            <div class="pagination">
                <span :class="{on: step === 1 }">&nbsp;</span>
                <span :class="{on: step === 2 }">&nbsp;</span>
                <span :class="{on: step === 3 }">&nbsp;</span>
            </div>

            <button type="button" @click="$router.push('/import')" class="btn trans js-import">
                <span>{{ $t('fileImport').title}}</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Account, Network } from '../../../../store/modules/account/account.interface';
    import createPassword from './components/create-password.component.vue';
    import importPrivateKey from '../../../../components/import-private-key.component.vue';
    import selectAccount from '../../../../components/select-account.component.vue';

    @Component({
        components: {
            createPassword,
            importPrivateKey,
            selectAccount,
        },
    })
    export default class SignUp extends Vue {
        extensionWidth: number = 375;
        gap: number = 0;
        step: number = 1;
        password: string = '';
        account: Account = {
            network: {
                name: '',
                httpEndpoint: '',
                chainId: '',
                symbol: '',
            },
            privateKey: '',
            name: '',
        };

        /**
         * 화면 전환
         * @param {boolean} direction
         */
        progressiveMove(direction: boolean) {
            // 다음 화면 이동
            this.gap = direction ? this.gap - this.extensionWidth : this.gap + this.extensionWidth;
        }

        progressiveLevel(direction: boolean) {
            this.progressiveMove(direction);
            // 현재 스텝정보 갱신
            this.step = direction ? this.step + 1 : this.step - 1;
        }

        /** step1 */
        createPassword(password: string) {
            this.password = password;
            this.progressiveLevel(true);
        }

        /** step2 */
        async importPrivateKey(privateKey: string, network: Network) {
            this.account.privateKey = privateKey;
            this.account.network = network;
            this.progressiveLevel(true);
        }

        /** step3 계좌 선택 */
        async createWallet(account: any) {
            try {
                this.account.name = account;
                await this.$store.dispatch('createWallet', {account, password: this.password});
                setTimeout(() => this.$router.replace('/'));
            } catch (e) {
                if (e.message === 'notActiveKey') {
                    this.$store.dispatch('setErrorModal', {error: this.$i18n.t('error.notActiveKey')});
                    this.back();
                }
            }
        }

        back() {
            this.progressiveLevel(false);
        }
    }
</script>
