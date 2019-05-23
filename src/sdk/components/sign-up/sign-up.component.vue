<template>
    <div>
        <div class="DH25"></div>
        <div class="middle-box" v-html="$t('error').needAddWallet">
        </div>
        <div class="sign-body__submit">
            <button type="button" @click="close" class="btn submit">
                <span>{{ $t('button').close }}</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class SignUp extends Vue {
        close() {
            self.close();
        }
    }
</script>
