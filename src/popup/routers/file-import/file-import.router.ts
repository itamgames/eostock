import fileImport from './file-import.route.vue';

export default [
    {
        path: '/import',
        name: 'import',
        component: fileImport,
        meta: {
            notHeader: true,
            notCheckAccount: true,
        },
    },
];
