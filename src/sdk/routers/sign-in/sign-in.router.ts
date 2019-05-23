import signIn from './sign-in.route.vue';

export default [
    {
        path: '/sign-in',
        name: 'signIn',
        component: signIn,
        meta: {
            notHeader: true,
        },
    },
];
