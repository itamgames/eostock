<template>
    <div id='app' @click.stop='clickEvent' class='wrap'>
        <header-layout></header-layout>
        <main>
            <router-view/>
        </main>
        <loader></loader>
    </div>
</template>

<script lang='ts'>
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import loader from '../common/components/loader/loader.component.vue';
    import headerLayout from './layout/header.layout.vue';

    @Component({
        components: {
            loader,
            headerLayout,
        },
    })
    export default class App extends Vue {
        ing: boolean = false;

        clickEvent() {
            if (!this.ing) {
                this.ing = true;
                this.$store.dispatch('checkAutoLock');
                setTimeout(() => this.ing = false, 1000);
            }
        }

        /**
         * lock이 걸리면 로그인으로 이동한다.
         *
         * @param val
         */
        @Watch('$store.getters.walletIsLock')
        isLock(val: any) {
            if (val) {
                this.$router.push('/sign-in');
            }
        }
    }
</script>

