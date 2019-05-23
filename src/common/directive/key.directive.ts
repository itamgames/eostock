import Vue from 'vue';

Vue.directive('onlyEnglish', (el: any, binding: any) => {
    if (!(/^[A-Z+]*$/.test(el.value))) {
        const newValue = el.value.replace(/[^(A-Z)]/gi, '');
        el.value = newValue;
        binding.value = el.value;
    }
});
