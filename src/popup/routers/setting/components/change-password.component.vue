<template>
    <div>
        <div class="password">
            <h6 class="h-gap-15 align-left">{{ $t('setting').pwTitle }}</h6>
            <div class="pannel small">
                <div class="script-box">
                    {{ $t('setting').pwScript }}
                </div>
                <form @submit.prevent="checkAndOpenModal">
                    <input class="block-input" type="password" id="password"
                           v-model="password"
                           :placeholder="$t('setting').pwPlaceholder"
                           autofocus>
                    <button type="submit" class="btn submit small">
                        <span>{{ $t('button').change }}</span>
                    </button>
                    <div class="error" v-if="error.passwordError">
                        <span>{{ $t('setting')[error.passwordError] }}</span>
                    </div>

                </form>
            </div>
        </div>
        <modal v-model="isOpenModal">
            <div class="password-change">
                <div class="script-box">
                    {{$t('setting').newPwScript}}
                </div>
                <form @submit.prevent="changePassword">
                    <input class="block-input" type="password" id="newPassword"
                           v-model="newPassword"
                           :placeholder="$t('setting').pwNewPlaceholder"
                           autofocus>
                    <input class="block-input" type="password" id="confirmPassword"
                           v-model="confirmPassword"
                           :placeholder="$t('signUp').confirmPassword"
                           autofocus>
                    <div class="error" v-if="error.newPassword">
                        <span>{{ $t('setting')[error.newPassword] }}</span>
                    </div>
                    <div class="align-center">
                        <button type="button" class="btn submit small" @click="closeModal"><span>{{ $t('button').cancel }}</span>
                        </button> &nbsp;
                        <button type="submit" class="btn submit small"><span>{{ $t('button').change }}</span></button>
                    </div>
                </form>
            </div>
        </modal>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import modal from '../../../../common/components/modal/modal.component.vue';

    @Component({
        components: {
            modal,
        },
    })
    export default class ChangePassword extends Vue {
        isOpenModal: boolean = false;
        password: string = '';
        newPassword: string = '';
        confirmPassword: string = '';
        error: any = {
            passwordError: '',
            newPassword: '',
        };

        async checkAndOpenModal() {
            this.error.passwordError = '';
            if (!this.password) {
                this.error.passwordError = 'pwPlaceholder';
                return;
            }
            try {
                await this.$store.dispatch('checkPassword', this.password);

                this.isOpenModal = true;
            } catch (e) {
                this.error.passwordError = 'pwError';
            }
        }

        async changePassword() {
            this.error.newPassword = '';
            if (!this.newPassword) {
                this.error.newPassword = 'pwNewPlaceholder';
                return;
            }
            if (this.newPassword !== this.confirmPassword) {
                this.error.newPassword = 'pwNotMatch';
                return;
            }

            try {
                await this.$store.dispatch('changePassword',
                    {oldPassword: this.password, newPassword: this.newPassword});
                this.newPassword = '';
                this.confirmPassword = '';
                this.password = '';
            } catch (e) {
                this.error.passwordError = 'pwError';
            } finally {
                this.isOpenModal = false;
            }

        }

        closeModal() {
            this.error.newPassword = false;
            this.newPassword = '';
            this.confirmPassword = '';
            this.password = '';
            this.isOpenModal = false;
        }
    }
</script>
