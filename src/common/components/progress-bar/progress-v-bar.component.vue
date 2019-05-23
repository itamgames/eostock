<template>
    <div class="progress">
        <div class="progress-v"><div class="inside" :style="{height: `${Number(insideBarHeight)}%`}"></div></div>
        <div class="progress-data">
            {{ barData }}
        </div>
        <div class="progress-max">
            {{ barMax }}
        </div>
        <div class="progress-etc" v-if="barEtc">
            ({{ barEtc }})
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';

    @Component
    export default class ProgressBar extends Vue {
        @Prop({type: [String, Number], default: 0})
        barHeight!: string | number;
        @Prop({type: [String, Number], default: 0})
        barData!: string | number;
        @Prop({type: [String, Number], default: 0})
        barMax!: string | number;
        @Prop({type: [String, Number]})
        barEtc!: string | number;

        insideBarHeight: number = 0;

        created() {
            setTimeout(() => {
                this.insideBarHeight = Number(this.barHeight);
            }, 100);
        }
    }
</script>

<style lang="scss">
.progress {
    &-v {
        position: relative;
        width: 75px;
        margin: 0 auto;
        height: 60px;
        border-radius: 10px 10px 0 0;
        background: #fff;
        overflow: hidden;
        .inside {
            position: absolute;
            left: 0; right: 0; bottom: 0;
            background: #6035bd;
            transition: all 1s ease;
        }
    }
    &-data {
        width: 90px;
        line-height: 100%;
        margin: 0 auto;
        border-top:1px solid #bdb7c4;
        padding-top: 9px;
        color: #230f3b;
        font-weight: bold;
    }
    &-max {
        font-size: 12px;
    }
    &-etc {
        font-size: 11px;
    }
}
</style>
