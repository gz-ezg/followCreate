import Vue from 'vue';
import Router from 'vue-router';

import clientRecord from  '@/components/records/clientRecord';
import Login from  '@/components/login/login';
import clientIndex from '@/components/newClient/clientAdd';
import companyIndex from '@/components/newClient/companyAdd';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'Login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/clientRecord/:id',
      name: 'clientRecord',
      component: clientRecord
    },
    {
      path: '/clientIndex',
      name: 'clientIndex',
      component: clientIndex
    },
    {
      path: '/companyIndex',
      name: 'companyIndex',
      component: companyIndex
    }




  ]
})
