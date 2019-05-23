<template>
    <div class="cell">
        <!--비밀번호 설정-->
        <h5>{{ $t('signUp').step1Title }}</h5>
        <p v-html="$t('signUp').step1Script" :class="$i18n.locale"></p>
        <form @submit.prevent="createPassword">
            <input class="block-input" type="password" v-model="password"
                   :placeholder="$t('signUp').newPassword" autofocus>
            <input class="block-input" type="password" id="confirmPassword" v-model="confirmPassword"
                   :placeholder="$t('signUp').confirmPassword">
            <div class="error">
                <span v-if="isError">{{ $t('signUp').notEqualPassword }}</span>
            </div>
            <div class="sign-body__submit">
                <span><button type="submit" class="btn submit"><span>{{ $t('signUp').signUp }}</span></button></span>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class CreatePassword extends Vue {
        password: string = '';
        confirmPassword: string = '';
        isError: boolean = false;

        createPassword() {
            this.isError = false;
            if (!this.password || this.password !== this.confirmPassword) {
                this.isError = true;
                this.focusPassword();
                return;
            }

            this.$emit('createPassword', this.password);
        }

        focusPassword() {
            const el = document.getElementById('confirmPassword');
            if (el) {
                el.focus();
            }
        }
    }
</script>
