<template>
    <ul class="toast">
        <li v-for="(item, key) in toasts" :key="key"
            :class="{ open: item.open }"
            :style="{top: `${item.top}px`}"
            @click="removeToast(key)"
        >
            <span>{{ item.message }}</span>
        </li>
    </ul>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { EventBus } from '../../services/vue-event-bus.service';

    @Component
    export default class Toast extends Vue {
        toasts: any = [];
        toastDelay: number = 2000;

        mounted() {
            EventBus.$on('toast', (message: string) => {
                this.setToast(message);
            });
        }

        setToast(message: string) {
            const toast = {message, open: false, top: 20};
            this.toasts.unshift(toast);
            // start
            setTimeout(() => {
                toast.open = true;
                this.toasts.forEach((item: any, index: number) => {
                    item.top = index * 36;
                });
            }, 100);

            // end
            setTimeout(() => {
                toast.open = false;
            }, this.toastDelay);

            // remove
            setTimeout(() => {
                this.toasts.splice(-1, 1);
            }, this.toastDelay + 500);
        }

        removeToast(idx: number) {
            this.toasts[idx].open = false;
        }
    }
</script>
