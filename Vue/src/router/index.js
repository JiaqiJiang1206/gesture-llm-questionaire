
import { createRouter, createWebHashHistory } from 'vue-router';

import myLogin from '../components/myLogin.vue';
import formFill from '../components/formFill.vue';
import endPage from '../components/endPage.vue';
import { userGlobalData } from '../stores/store';
import Congratulations from '../components/Congratulations.vue';

const routes = [
    { path: '/', component: myLogin },
    {
        path: '/formFill',
        component: formFill,
        beforeEnter(to, from) {
            if (userGlobalData.value.name === 'undefined') {
                return false;
            }
        },
    },
    { path: '/endPage', component: Congratulations },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});



export default router; // 导出 router
