<template>
    <div class="backup">
        <div class="gap-h"></div>
        <div class="backup-import">
            <h5>{{ $t('fileImport').title }}</h5>
            <form @submit.prevent="importBackupFile">
                <fieldset class="input-file">
                    <input type="file" id="myFile" accept="text/*" ref="file" @change="handleFileUpload"/>
                    <span v-if="!file.name">{{ $t('fileImport').fileName }}</span>
                    <span v-else>{{file.name}}</span>
                    <label for="myFile">{{ $t('button').file }}</label>
                </fieldset>

                <input type="password" v-model="password" class="block-input" :placeholder="$t('fileImport').password"/>
                <p class="warning error" v-if="error">{{ $t('fileImport')[error] }}</p>
                <p class="warning" v-else>{{ $t('fileImport').attention }}</p>

                <ul class="col-row col-l-r">
                    <li class="col-1-2">
                        <button type="button" class="btn submit" @click="$router.go(-1)">
                            <span>{{ $t('button').cancel }}</span>
                        </button>
                    </li>
                    <li class="col-1-2">
                        <button type="submit" class="btn submit">
                            <span>{{ $t('button').ok }}</span>
                        </button>
                    </li>
                </ul>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Backup extends Vue {
    password: string = '';
    file: any = {};
    encryptWallet: string = '';
    error: string = '';

    async importBackupFile() {
        this.error = '';
        if (!this.encryptWallet) {
            this.error = 'emptyFile';
            return;
        }
        if (!this.password) {
            this.error = 'emptyPass';
            return;
        }

        try {
            await this.$store.dispatch('importWallet', {
                password: this.password,
                encryptWallet: this.encryptWallet,
            });
            this.$router.replace('/');
        } catch (e) {
            this.error = 'error';
        }
    }

    handleFileUpload() {
        this.encryptWallet = '';
        const fileEl: any = this.$refs.file;
        const file = fileEl.files[0];

        if (file) {
            this.file = file;
            const fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = () => {
                this.encryptWallet = (fileReader.result || '').toString();
            };
        }
    }
}
</script>
