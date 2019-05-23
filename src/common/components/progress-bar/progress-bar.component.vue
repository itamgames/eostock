<template>
    <div class="progress">
        <div class="inside bar1" :style="{width: `${bar1}%`}"></div>
        <div class="inside bar2" :style="{left: `${bar1}%`, width:  `${bar2}%`}"></div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';

    @Component
    export default class ProgressBar extends Vue {
        @Prop({type: [Number], default: 0})
        staked!: number;
        @Prop({type: [Number], default: 0})
        unstaked!: number;

        bar1: number = 0;
        bar2: number = 0;

        created() {
            setTimeout(() => {
                this.bar1 = this.staked;
                this.bar2 = this.unstaked;
            }, 80);
        }
    }
</script>

<style scoped lang="scss">
.progress {
    width: 100%;
    height: 2px;
    position: relative;
    background-color: #b11e4b;

    .inside {
        position: absolute;
        left: 0; top: 0;
        width: 0;
        height: 2px;
        box-sizing: border-box;
        border-right: 2px solid #fff;
        transition: all 1s ease;
        &.bar1 {
            background-color: #6035bd;
        }
        &.bar2 {
            background-color: #f2be2e;
        }
    }
}
</style>
