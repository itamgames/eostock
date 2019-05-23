import signIn from './in.route.vue';

export default [
    {
        path: 'in',
        name: 'signIn',
        component: signIn,
        meta: {
            notHeader: true,
            notCheckAccount: true,
        },
    },
];
