<template>
    <div v-if="enable" ref="dropdown">
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

    @Component
    export default class Dropdown extends Vue {
        enable: boolean = false;
        @Prop()
        value!: boolean;
        @Prop({default: true})
        autoClose!: boolean;
        @Prop({default: false})
        autoCloseOut!: boolean;

        created() {
            this.windowClose();
        }

        windowClose() {
            const el: any = document.getElementById('app');
            el.addEventListener('click', this.autoCloseFn);
        }

        autoCloseFn(el: any) {
            const dropdownEl: any = this.$refs.dropdown;
            if (dropdownEl) {
                if (this.autoCloseOut && dropdownEl.innerHTML.trim().includes(el.target.innerHTML.trim())) {
                    return;
                }

                if (this.enable) {
                    this.$emit('input', false);
                    this.removeListener();
                }
            }
        }

        removeListener() {
            const el: any = document.getElementById('app');
            el.removeEventListener('click', this.autoCloseFn);
        }

        @Watch('value')
        changeIsOpen(val: boolean) {
            if (val) {
                this.windowClose();
            }
            this.enable = val;
        }
    }
</script>

<style scoped lang="scss">
</style>
