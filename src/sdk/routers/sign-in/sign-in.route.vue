<template>
    <div class="sign">
        <div class="gap-h"></div>
        <div class="sign-head">
            <div class="sign-head__logo">
                <img alt="Itam Games" src="../../assets/logo-sign.svg"/>
            </div>
            <p v-html="$t('signUp').script" :class="$i18n.locale"></p>
        </div>
        <div class="sign-body">
            <div class="sign-body__box">
                <div class="cell">
                    <h5>{{ $t('signIn').title }}</h5>
                    <p v-html="$t('signIn').script" :class="$i18n.locale"></p>
                    <div class="DH25"></div>
                    <form @submit.prevent="signInLocalWallet">
                        <input class="block-input" type="password" id="password" v-model="password"
                               :placeholder="$t('signIn').password"
                               autofocus>
                        <div class="error">
                            <span v-if="error">{{ $t('signIn')[error] }}</span>
                        </div>
                        <div class="DH15"></div>
                        <div class="sign-body__submit">
                            <button type="submit" class="btn submit"><span>{{ $t('signIn').ok }}</span></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class SignIn extends Vue {
        password: string = '';
        error: string = '';

        mounted() {
            this.$nextTick(() => {
                const el = document.getElementById('password');
                if (el) {
                    el.focus();
                }
            });
        }

        async signInLocalWallet() {
            this.error = '';
            if (!this.password) {
                this.error = 'password';
                return;
            }

            try {
                await this.$store.dispatch('signInWallet', this.password);
                setTimeout(() => this.$router.push({name: this.$store.getters.pathName}));
            } catch (e) {
                this.error = 'error';
            }
        }
    }
</script>
