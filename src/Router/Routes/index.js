import { lazy } from 'react';

const DefaultRoute = "/";
const routes = [
  {
    path: '/',
    element: lazy(() => import('../../ui/pages/SignIn')),  
    layout: 'user',
  },
  {
    path:'/forgot-password',
    element: lazy(() => import('../../ui/pages/ForgotPassword')),
    layout: 'user',
  },
  {
    path:'/sign-up',
    element: lazy(() => import('../../ui/pages/SignUp')),
    layout: 'user',
  },
  {
    path:'/admin-dashboard',
    element: lazy(() => import('../../ui/pages/AdminDashboard')),
    layout: 'admin',
  },
  {
    path:'/dashboard',
    element: lazy(() => import('../../ui/pages/Dashboard')),
  },
  {
    path:'/users',
    element: lazy(() => import('../../ui/pages/User')),
    layout: 'admin',
  },
  {
    path:'/admin-profile',
    element: lazy(() => import('../../ui/pages/Profile')),
    layout: 'admin',
  },
  {
    path:'/add-book',
    element: lazy(() => import('../../ui/pages/AddBook')),
    layout: 'admin',
  }
];

export {DefaultRoute, routes };
