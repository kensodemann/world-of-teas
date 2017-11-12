import Vue from 'vue';
import Router from 'vue-router';
import BrowseByCategory from '@/components/pages/browse-by-category';
import BrowseByRating from '@/components/pages/browse-by-rating';
import Home from '@/components/pages/home';
import Links from '@/components/pages/links';
import Login from '@/components/pages/login';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/categories',
      name: 'Categories',
      component: BrowseByCategory
    },
    {
      path: '/links',
      name: 'Links',
      component: Links
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/ratings',
      name: 'Ratings',
      component: BrowseByRating
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
});
