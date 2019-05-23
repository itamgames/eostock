import connectionError from './connection-error.route.vue';

export default [
    {
        path: '/connection-error',
        name: 'connectionError',
        component: connectionError,
        meta: {
            notHeader: true,
            notCheckAccount: true,
        },
    },
];
