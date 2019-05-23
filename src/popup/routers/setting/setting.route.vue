<template>
    <div class="setting">
        <auto-lock></auto-lock>
        <change-password></change-password>
        <change-lang></change-lang>

        <div class="backup">
            <h6 class="h-gap-15 align-left">백업</h6>
            <div class="pannel">
                <span class="script" v-html="$t('backup').script"></span>
                <button type="button"
                        @click="backup"
                        class="btn submit small">
                    <span>{{ $t('backup').backupBtn }}</span>
                </button>
            </div>
        </div>

        <reset></reset>

        <div class="DH15"></div>

        <div class="ver">
            Version {{version}}
        </div>

        <div class="DH25"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import autoLock from './components/auto-lock.component.vue';
import changePassword from './components/change-password.component.vue';
import changeLang from './components/change-lang.component.vue';
import reset from './components/reset.component.vue';
import { getHash } from '../../../common/utils/crypto.utils';

@Component({
    components: {
        autoLock,
        changePassword,
        changeLang,
        reset,
    },
})
export default class Setting extends Vue {
    version: any = process.env.VUE_APP_VERSION;

    async backup() {
        const download: any = document.createElement('a');
        download.download = getHash() + '.txt';
        download.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.$store.getters.encryptWallet);
        download.click();
    }
}
</script>
