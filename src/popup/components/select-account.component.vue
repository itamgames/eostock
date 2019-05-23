<template>
    <div class="cell">
        <h5>{{ $t('signUp').step3Title }}</h5>
        <div v-if="Object.keys(accountsByKey).length > 0">
            <div class="list-box">
                <ul>
                    <li v-for="(_account, index) in accountsByKey" :key="index">
                        <button @click.prevent="selectWallet(_account)" class="btn"
                                :class="{ on: account === _account }">
                            <span>{{ _account.name }}</span>
                        </button>
                    </li>
                </ul>
            </div>
            <ul class="col-row col-l-r">
                <li class="col-1-2">
                    <button type="button" class="btn submit" @click="back">
                        <span>{{ $t('button').historyBackView }}</span>
                    </button>
                </li>
                <li class="col-1-2">
                    <button type="button" class="btn submit" @click="createWallet">
                        <span>{{ $t('button').ok }}</span>
                    </button>
                </li>
            </ul>
        </div>
        <div v-else>
            <div class="DH25"></div>
            <div class="middle-box">
                {{ $t('signUp').step3Error }}
            </div>
            <div class="sign-body__submit">
                <button type="button" @click="back" class="btn submit">
                    <span>{{ $t('button').historyBackView }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { mapGetters } from 'vuex';

    @Component({
        computed: {
            ...mapGetters([
                'accountsByKey',
            ]),
        },
    })
    export default class SelectAccount extends Vue {
        account: any = null;

        selectWallet(account: any) {
            this.account = account;
        }

        createWallet() {
            this.$emit('createWallet', this.account);
        }

        back() {
            this.$emit('back');
        }

        @Watch('$store.getters.accountsByKey')
        addInitAccount(val: any) {
            this.account = val[Object.keys(val)[0]];
        }
    }
</script>
