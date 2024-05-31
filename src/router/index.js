import Vue from 'vue';
import Router from 'vue-router';
import AppLogin from '../components/AppLogin.vue';
import AppPlaylist from '../components/AppPlaylist.vue';
import PlaylistDetail from '../components/PlaylistDetail.vue';
import MoodSelector from '../components/MoodSelector.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: AppLogin
    },
    {
      path: '/callback',
      name: 'Callback',
      component: AppPlaylist
    },
    {
      path: '/playlist/:id',
      name: 'PlaylistDetail',
      component: PlaylistDetail
    },
    {
      path: '/mood',
      name: 'MoodSelector',
      component: MoodSelector
    }
  ]
});
