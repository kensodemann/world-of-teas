import Vue from 'vue';
import Router from 'vue-router';
import BrowseByCategory from '@/components/pages/browse-by-category';
import BrowseByRating from '@/components/pages/browse-by-rating';
import ChangePassword from '@/components/pages/change-password';
import Home from '@/components/pages/home';
import Links from '@/components/pages/links';
import Login from '@/components/pages/login';
import Profile from '@/components/pages/profile';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/categories',
      name: 'Categories',
      component: BrowseByCategory
    },
    {
      path: '/change-password',
      name: 'Change Password',
      component: ChangePassword
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
      path: '/profile',
      name: 'My Profile',
      component: Profile
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
