<template>
    <header v-if="enable">
        <div class="header">
            <img alt="EOStock" src="../assets/logo-eostock.svg" />
        </div>
    </header>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';

    @Component
    export default class HeaderLayout extends Vue {
        enable: boolean = true;

        created() {
            this.enable = !this.$route.meta.notHeader;
        }

        @Watch('$route')
        onRouteChanged(val: any) {
            this.enable = !val.meta.notHeader;
        }
    }
</script>
