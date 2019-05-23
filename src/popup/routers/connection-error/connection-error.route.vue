<template>
    <div>
        <div class="gap-h"></div>
        <div class="backup export">
            <div class="pannel">
                <h3>{{ $t('connectionError').title }}</h3>
                <p class="script" v-html="$t('connectionError').script"></p>
                <button type="button" @click="refresh" class="btn submit">
                    <span>{{ $t('button').refresh }}</span>
                </button>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { EosService } from '../../../common/services/eos.service';

    @Component
    export default class ConnectionError extends Vue {
        async refresh() {
            await EosService.Instance.info();

            await this.$store.dispatch('loadWallet');
            const encryptWallet = this.$store.getters.encryptWallet;
            if (encryptWallet) {
                if (this.$store.getters.walletIsLock) {
                    this.$router.push('/sign/in');
                } else {
                    this.$router.push('/');
                }
            } else {
                this.$router.push('/sign/up');
            }
        }
    }
</script>
