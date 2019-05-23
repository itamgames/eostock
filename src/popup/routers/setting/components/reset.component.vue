<template>
    <div>
        <div class="reset">
            <h6 class="h-gap-15 align-left">{{ $t('setting').resetTitle }}</h6>
            <div class="pannel small">
                <div class="col-row">
                    <span class="script">{{ $t('setting').resetScript }}</span>
                    <button type="button"
                            @click="isOpenModal = true"
                            class="btn submit danger small">
                        <span>{{ $t('button').reset }}</span>
                    </button>
                </div>

            </div>
        </div>

        <modal v-model="isOpenModal">
            <div class="align-center">
                <div class="DH15"></div>
                <div class="align-center" v-html="$t('setting').resetModalScript"></div>
                <div class="DH25"></div>
                <div class="btn-smalls">
                    <button type="button" class="btn submit small"
                            @click="isOpenModal = false">
                        <span>{{ $t('button').cancel }}</span>
                    </button>
                    <button type="button" class="btn submit small danger"
                            @click="setReset">
                        <span>{{ $t('button').ok }}</span>
                    </button>
                </div>
            </div>
        </modal>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import modal from '../../../../common/components/modal/modal.component.vue';

@Component({
    components: {
        modal,
    },
})
export default class Reset extends Vue {
    isOpenModal: boolean = false;

    async setReset() {
        await this.$store.dispatch('reset');
        this.$router.replace('/sign/up');
    }
}
</script>
