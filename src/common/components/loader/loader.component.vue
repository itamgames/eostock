<template>
    <div class="loading" v-if="loading">
        <div class="sidebar-overlay"></div>
        <div class="loader">Loading...</div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class Loading extends Vue {
        get loading() {
            return this.$store.getters.loading;
        }
    }
</script>

<style scoped lang="scss">
    .loading {
        position: fixed;
        height: 100%;
        width: 100%;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;

        .sidebar-overlay {
            z-index: 999;
            position: fixed;
            height: 100%;
            width: 100%;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 1;
            visibility: visible;
            background-color: rgba(0, 0, 0, 0.7);
        }

        .loader,
        .loader:before,
        .loader:after {
            border-radius: 50%;
            width: 2.5em;
            height: 2.5em;
            z-index: 1000;
            -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
            -webkit-animation: load7 1.8s infinite ease-in-out;
            animation: load7 1.8s infinite ease-in-out;
        }

        .loader {
            color: #ffffff;
            font-size: 10px;
            margin: 250px auto;
            position: relative;
            text-indent: -9999em;
            -webkit-transform: translateZ(0);
            -ms-transform: translateZ(0);
            transform: translateZ(0);
            -webkit-animation-delay: -0.16s;
            animation-delay: -0.16s;
        }

        .loader:before,
        .loader:after {
            content: '';
            position: absolute;
            top: 0;
        }

        .loader:before {
            left: -3.5em;
            -webkit-animation-delay: -0.32s;
            animation-delay: -0.32s;
        }

        .loader:after {
            left: 3.5em;
        }

        @-webkit-keyframes load7 {
            0%,
            80%,
            100% {
                box-shadow: 0 2.5em 0 -1.3em;
            }
            40% {
                box-shadow: 0 2.5em 0 0;
            }
        }

        @keyframes load7 {
            0%,
            80%,
            100% {
                box-shadow: 0 2.5em 0 -1.3em;
            }
            40% {
                box-shadow: 0 2.5em 0 0;
            }
        }
    }
</style>
