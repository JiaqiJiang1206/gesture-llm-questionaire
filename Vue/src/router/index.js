
import {createRouter, createWebHashHistory} from 'vue-router';

import myLogin from '../components/myLogin.vue';
import formFill from '../components/formFill.vue';
import endPage from '../components/endPage.vue';

const routes = [
    { path: '/', component: myLogin },
    { path: '/formFill', component: formFill },
    { path: '/endPage', component: endPage },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router; // 导出 router
