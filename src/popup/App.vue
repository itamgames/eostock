<template>
    <div id='app' @click.stop='clickEvent' class='wrap'>
        <header-layout></header-layout>
        <main>
            <router-view/>
        </main>
        <loader></loader>
        <toast></toast>
        <error-modal></error-modal>
        <transaction-modal></transaction-modal>
    </div>
</template>

<script lang='ts'>
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import headerLayout from './layout/header.layout.vue';
    import loader from '../common/components/loader/loader.component.vue';
    import toast from '../common/components/toast/toast.component.vue';
    import errorModal from '../common/components/modal/error-modal/error-modal.component.vue';
    import transactionModal from '../common/components/modal/transaction-modal/transaction-modal.component.vue';

    @Component({
        components: {
            headerLayout,
            loader,
            toast,
            errorModal,
            transactionModal,
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
                this.$router.push('/sign/in');
            }
        }
    }
</script>

