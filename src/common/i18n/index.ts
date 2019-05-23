import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '../../popup/store/index';
import { ChromeStorageService } from '@/common/services/chrome-storage.service';

Vue.use(VueI18n);
const lang = require('./lang.json');

export const i18n: any = new VueI18n({locale: 'en', messages: lang});

export const settingLocale = async () => {
    let language: any = await ChromeStorageService.get('locale');

    if (!language) {
        if (navigator.languages && navigator.languages.length) {
            language = navigator.languages[0];
        } else {
            language = navigator.language;
        }
    }
    const locale = language.substr(0, 2);
    i18n.locale = i18n.messages[locale] ? locale : 'en';
    if (i18n.locale !== language) {
        ChromeStorageService.set('locale', i18n.locale);
    }
    store.dispatch('setLanguage', i18n.locale);
};
