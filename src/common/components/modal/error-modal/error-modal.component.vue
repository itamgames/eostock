<template>
    <div class="modal-error">
        <div class="mask" v-if="errorModal.error" @click.prevent="close()"></div>
        <div class="modal" v-if="errorModal.error">
            <div class="modal-body">
                <div class="modal-transfer">
                    <div class="align-center">
                        <h5 class="fail-msg" :class="{'with-msg': errorModal.detail}" v-html="errorModal.error"></h5>
                        <div v-if="errorModal.detail" class="msg-box" v-html="errorModal.detail"></div>
                        <button type="button" @click="close" class="btn submit small">
                            <span>{{ $t('button').close }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { EventBus } from '../../../services/vue-event-bus.service';
    import { mapGetters } from 'vuex';

    @Component({
    computed: {
        ...mapGetters([
            'errorModal',
        ]),
    },
})
export default class ProgressBar extends Vue {
    close() {
        this.$store.dispatch('setErrorModal', {});
        EventBus.$emit('closeErrorModal');
    }
}
</script>
<style scoped>
    .mask {
        z-index: 900
    }
    .modal {
        z-index: 999
    }
</style>
