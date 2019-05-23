import sign from './sign.route.vue';

import signIn from './sub-router/in/in.router';
import signUn from './sub-router/up/up.router';

export default [
    {
        path: '/sign',
        name: 'sign',
        component: sign,
        children: [
            ...signIn,
            ...signUn,
        ],
    },
];
