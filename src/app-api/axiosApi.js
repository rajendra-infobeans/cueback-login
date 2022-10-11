import axios from 'axios';
// import isBrowser from '../util/gatsby';
const isBrowser = typeof window !== 'undefined';
const baseURL =
  process.env.REACT_APP_VERCEL_ENV === 'production'
    ? 'https://mystoriesmatter.com/api'
    : 'https://public.cuebackqa.com/api';
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((req) => {
  if (isBrowser) {
    req.headers['X-CSRF-TOKEN'] = localStorage.getItem('idToken');
  }
  return req;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.error('Error: ', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
