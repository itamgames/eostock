<template>
    <div>
        <div class="mask" v-if="isOpen" @click.prevent="close()"></div>
        <div class="modal" v-if="isOpen">
            <div class="modal-body">
                <div class="modal-transfer">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    @Component
    export default class ProgressBar extends Vue {
        @Prop()
        value!: boolean;

        @Prop({default: true})
        autoClose!: boolean;

        isOpen: boolean = false;

        close() {
            if (this.autoClose) {
                this.isOpen = false;
                this.$emit('input', this.isOpen);
            }
        }

        @Watch('value')
        changeValue(isShow: boolean) {
            this.isOpen = isShow;
        }
    }
</script>