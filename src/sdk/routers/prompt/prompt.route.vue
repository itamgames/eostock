<template>
    <section class="prompt">
        <div class="col-row prompt-header">
            <div class="col-1-2 align-left">
                <small>{{ host }}</small>
                <h3>Signature Request</h3>
            </div>
            <div class="col-1-2 align-right">
                <span>{{ account.name }}</span>
            </div>
        </div>
        <div v-for="(action) in actions">
            <div class="pannel align-left">
                <div class="title">
                    <span v-html="$t('popup').contractAction">컨트랙트 / 액션</span>
                    <h3>{{ action.contract }} / {{ action.action }}</h3>
                </div>
                <div class="infobox">
                    <div class="align-left" v-for="(data, key) in action.data">
                        <span>{{ key }}</span>
                        <p>{{ data }}</p>
                    </div>
                </div>
            </div>
            <div class="DH15"></div>

        </div>

        <div class="btn-account row">
            <button type="button"
                    class="btn submit danger" @click="reject">
                <span v-html="$t('button').reject">거절</span>
            </button>
            <button type="button"
                    class="btn submit" @click="submit">
                <span v-html="$t('button').accept">수락</span>
            </button>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ErrorModule } from '@/common/error';
import { decrypt } from '@/common/utils/crypto.utils';
import { chromeRuntimeSend } from '@/common/services/chrome-runtime.service';
import { SignatureService } from '../../../common/services/signature.service';
import { mapGetters } from 'vuex';

const request = (window as any).data;

@Component({
    computed: {
        ...mapGetters([
            'account',
            'actions',
            'accounts',
        ]),
    },
})
export default class Prompt extends Vue {
    host: string = request.payload.host;

    async created() {
        const requestPayload = request.payload;
        await this.$store.dispatch('getAccount', requestPayload.host);
        this.$store.dispatch('initPrompt', requestPayload.actions);
    }

    reject() {
        this.$store.dispatch('errorResponse', ErrorModule.reject());
    }

    async submit() {
        const account = this.$store.getters.account;
        const password: any = await chromeRuntimeSend('get');
        const privateKey = decrypt(account.privateKey, password);
        const sign = SignatureService.sign(request.payload.buf, privateKey);

        this.$store.dispatch('response', sign);
    }
}
</script>
