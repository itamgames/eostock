import Vue from 'vue';
import Router from 'vue-router';

import signIn from './sign-in/sign-in.router';
import login from './login/login.router';
import prompt from './prompt/prompt.router';

Vue.use(Router);

const router: any = new Router({
    routes: [
        ...signIn,
        ...login,
        ...prompt,
    ],
});

export default router;
