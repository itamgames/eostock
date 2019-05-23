<template>
    <div>
        <div class="language">
            <h6 class="h-gap-15 align-left">{{ $t('setting').langTitle }}</h6>
            <div class="pannel small">
                <div class="col-row">
                    <span class="script">{{ languageName }}</span>
                    <button type="button"
                            @click="openModal"
                            class="btn submit small">
                        <span>{{ $t('button').change }}</span>
                    </button>
                </div>

            </div>
        </div>

        <modal v-model="isOpenModal">
            <div class="modal-lang">
                <div class="DH15"></div>
                <div class="radio-group">
                    <input type="radio" id="en" name="chkLang" value="en" v-model="language"/>
                    <label for="en">
                        <span>English</span>
                    </label>

                    <input type="radio" id="ko" name="chkLang" value="ko" v-model="language"/>
                    <label for="ko">
                        <span>한국어</span>
                    </label>
                </div>
                <div class="DH25"></div>
                <button type="button" class="btn submit small"
                        @click="setLanguage">
                    <span>{{ $t('setting').langBtn }}</span>
                </button>
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
    export default class ChangeLang extends Vue {
        isOpenModal: boolean = false;
        language: string = this.$store.getters.language;

        openModal() {
            this.isOpenModal = true;
        }

        setLanguage() {
            this.$store.dispatch('setLanguage', this.language);
            this.isOpenModal = false;
        }

        get languageName() {
            return this.$store.getters.language === 'ko' ? '한국어' : 'English';
        }
    }
</script>
