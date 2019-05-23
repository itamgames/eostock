import Vue from 'vue';
import moment from 'moment-timezone';

const jstz = require('jstz');
const timezone = jstz.determine().name();

Vue.filter('comma', (value: any, length: number = 4) => {
    if (!value) {
        return value;
    }

    const values = value.toString().split(' ');

    const numbers: any = Number(values[0]).toString().split('.');
    const regexp = /\B(?=(\d{3})+(?!\d))/g;
    let decimal = numbers[1];

    if (length && decimal) {
        decimal = decimal.toString().substr(0, length);
    }
    return numbers[0].replace(regexp, ',') + (decimal ? '.' + decimal : '') + (values[1] ? ' ' + values[1] : '');
});

/**
 * 바이트 1024단위로 바뀐
 */
Vue.filter('byte', (byte: number) => {
    if (!byte) {
        return 0 + ' byte';
    }

    if (byte < 1024) {
        return byte + ' byte';
    } else if (byte < (1024 * 1024)) {
        return (byte / 1024) + ' KB';
    } else if (byte < (1024 * 1024 * 1024)) {
        return (byte / (1024 * 1024)) + ' MB';
    } else {
        return (byte / (1024 * 1024 * 1024)) + ' GB';
    }
});

/**
 * us 단위 변경
 */
Vue.filter('us', (us: number) => {
    if (!us) {
        return 0 + ' us';
    }
    if (us < 1000) {
        return us + ' us';
    } else if (us < 1000 * 1000) {
        return (us / 1000) + ' ms';
    } else if (us < (1000 * 1000 * 1000 * 60)) {
        return (us / (1000 * 1000)) + ' sec';
    } else if (us < (1000 * 1000 * 1000 * 60 * 60)) {
        return (us / (1000 * 1000 * 1000 * 60)) + ' min';
    } else if (us < (1000 * 1000 * 1000 * 60 * 60 * 24)) {
        return (us / (1000 * 1000 * 1000 * 60 * 60)) + ' hour';
    } else {
        return (us / (1000 * 1000 * 1000 * 60 * 60 * 24)) + ' day';
    }
});

Vue.filter('timezone', (date: any) => {
    return moment.utc(date).tz(timezone).toDate().toLocaleString();
});

Vue.filter('capitalize', (value: any) => {
    if (!value) {
        return '';
    }
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
});
