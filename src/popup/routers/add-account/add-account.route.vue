<template>
    <div class="account">
        <div class="account-body">
            <div ref="accountBox" class="account-body__box" :style="{ left: gap+'px' }">
                <!-- 계정 등록 -->
                <import-private-key @importPrivateKey="importPrivateKey"></import-private-key>
                <!-- 계정 선택 -->
                <select-account @createWallet="addAccount" @back="back"></select-account>
            </div>
        </div>
        <div class="pagination">
            <span :class="{on: step === 1 }">&nbsp;</span>
            <span :class="{on: step === 2 }">&nbsp;</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Account, Network } from '../../store/modules/account/account.interface';
    import importPrivateKey from '../../components/import-private-key.component.vue';
    import selectAccount from '../../components/select-account.component.vue';

    @Component({
        components: {
            importPrivateKey,
            selectAccount,
        },
    })
    export default class AddAccount extends Vue {
        extensionWidth: number = 375;
        gap: number = 0;
        step: number = 1;
        password: string = '';

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

        async importPrivateKey() {
            this.progressiveLevel(true);
        }

        async addAccount(account: any) {
            try {
                await this.$store.dispatch('addAccountToWallet', account);
                await this.$store.dispatch('getAccountInfo', account);
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
