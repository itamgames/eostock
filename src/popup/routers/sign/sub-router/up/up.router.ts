import signUp from './up.route.vue';

export default [
    {
        path: 'up',
        name: 'signUp',
        component: signUp,
        meta: {
            notHeader: true,
            notCheckAccount: true,
        },
    },
];
