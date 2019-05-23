import setting from './setting.route.vue';

export default [
    {
        path: '/setting',
        name: 'setting',
        component: setting,
        meta: {
            notCheckAccount: true,
        },
    },
];
