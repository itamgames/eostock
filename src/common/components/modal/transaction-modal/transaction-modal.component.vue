<template>
    <modal v-model="transactionId">
        <h6>Transaction ID</h6>
        <div class="transaction-code">
            <p>
                {{transactionId}}
            </p>
            <div class="align-right" :class="$i18n.locale">
                <span class="copy-msg" :class="{ none: !isCopied }">{{ $t('transfer').copyClip }}</span>
                <button type="button" class="btn trans underline" @click="transactionIdCopy">
                    {{ $t('button').copy }}
                </button> &nbsp;
                <a @click="goBlockExplorerTransaction" v-if="supprotNetwork" class="btn trans underline">{{ $t('button').view }}</a>
            </div>
        </div>
        <div class="align-center">
            <button type="button" @click="closeModal" class="btn submit small">
                <span>{{ $t('button').close }}</span>
            </button>
        </div>
    </modal>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import modal from '../modal.component.vue';
import { mapGetters } from 'vuex';
import { goBlockExplorerTransaction, supprotNetwork } from '@/common/utils/block-explorer.utils';

@Component({
    computed: {
        ...mapGetters([
            'transactionId',
            'account',
        ]),
    },
    components: {
        modal,
    },
})
export default class TransactionModal extends Vue {
    isCopied: boolean = false;

    closeModal() {
        this.isCopied = false;
        this.$store.dispatch('closeTransactionModal');
    }

    goBlockExplorerTransaction() {
        const getters = this.$store.getters;
        goBlockExplorerTransaction(getters.account.network.name, getters.transactionId);
    }

    transactionIdCopy() {
        const t: any = document.createElement('textarea');
        document.body.appendChild(t);
        t.value = this.$store.getters.transactionId;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
        this.isCopied = true;
    }

    get supprotNetwork() {
        return supprotNetwork(this.$store.getters.account.network.name);
    }
}
</script>
