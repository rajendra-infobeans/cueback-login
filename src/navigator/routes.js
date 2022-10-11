
import Login from '../features/login/Login';

export const routes = {
  app: {
    path: '/redirect',
  },
  login: {
    title: 'Login',
    path: '/auth/login',
    component: Login,
  },
  signup: {
    title: 'Sign up',
    path: '/auth/signup',
  },
};
