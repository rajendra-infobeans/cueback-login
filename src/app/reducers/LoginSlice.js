/* eslint-disable max-len */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LoginApi, SsoLogin } from '../../app-api/api';
import { FederatedSignIn, SignInApi } from '../../app-api/newApi';
import { loginObject, loginResponse } from '../../util/Format';
import { getDomain } from '../../util/functions';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

export const LoginAsync = createAsyncThunk('login/LoginApi', async (obj) => {
  const payload = process.env.REACT_APP_NEW_API === 'TRUE' ? obj : loginObject(obj)
  const response = process.env.REACT_APP_NEW_API === 'TRUE' ? await SignInApi(payload) : await LoginApi(payload);
  const result = process.env.REACT_APP_NEW_API === 'TRUE' ? response : loginResponse(response);
  const domain = getDomain();
  if (result.code === 200) {
    Cookies.set('uid', result.data.uid, { domain: domain });
    Cookies.set('idToken', result.data.token.idToken, { domain: domain });
    Cookies.set('refreshToken', result.data.token.refreshToken, { domain: domain });
    Cookies.set('auth_time', result.data.auth_time, { domain: domain });
    Cookies.set('email', result.data.email, { domain: domain });
    Cookies.set('exp', result.data.exp, { domain: domain });
    Cookies.set('fullName',result.data.fullName, { domain: domain });
  }
  return result;
});

export const GoogleLoginAsync = createAsyncThunk('login/GoogleLogin',async () => {
  const idToken = localStorage.getItem('CognitoIdentityServiceProvider.4ufoedd4so0jq9j8fd7k3oroua.' + localStorage.getItem('CognitoIdentityServiceProvider.4ufoedd4so0jq9j8fd7k3oroua.LastAuthUser') + '.idToken');
  const refreshToken = localStorage.getItem('CognitoIdentityServiceProvider.4ufoedd4so0jq9j8fd7k3oroua.' + localStorage.getItem('CognitoIdentityServiceProvider.4ufoedd4so0jq9j8fd7k3oroua.LastAuthUser') + '.refreshToken');
  // const idToken = localStorage.getItem('CognitoIdentityServiceProvider.4ufoedd4so0jq9j8fd7k3oroua.' + localStorage.getItem('CognitoIdentityServiceProvider.4ufoedd4so0jq9j8fd7k3oroua.LastAuthUser') + '.idToken');
  // const refreshToken = localStorage.getItem('CognitoIdentityServiceProvider.4ufoedd4so0jq9j8fd7k3oroua.' + localStorage.getItem('CognitoIdentityServiceProvider.4ufoedd4so0jq9j8fd7k3oroua.LastAuthUser') + '.refreshToken');
  const decoded = jwt_decode(idToken);
  const obj = {
    'cognitoUid': decoded.sub,
        'status': 'EXTERNAL_PROVIDER',
        'firstName': decoded.given_name,
        'lastName': decoded.family_name,
        'primaryEmail': decoded.email
  };
  const response = await FederatedSignIn(obj);
  const domain = getDomain();
  if(response.code === 200) {
    Cookies.set('uid', decoded.sub, { domain: domain });
    Cookies.set('idToken', idToken, { domain: domain });
    Cookies.set('refreshToken', refreshToken, { domain: domain });
    Cookies.set('auth_time', Math.floor(new Date().getTime() / 1000), { domain: domain });
    Cookies.set('email', decoded.email, { domain: domain });
  }
  return response;
})

export const SsoLoginAsync = createAsyncThunk('login/SsoLoginApi', async (obj) => {
  const result = await SsoLogin(obj);
  const response = loginResponse(result);
  const domain = getDomain();
  if (response.code === 200) {
    Cookies.set('uid', response.data.uid, { domain: domain });
    Cookies.set('idToken', response.data.token.idToken, { domain: domain });
    Cookies.set('refreshToken', response.data.token.refreshToken, { domain: domain });
    Cookies.set('auth_time', response.data.auth_time, { domain: domain });
    Cookies.set('email', response.data.email, { domain: domain });
    Cookies.set('exp', response.data.exp, { domain: domain });
  }
  return response;
}
);

const initialState = {
  LoginResponse: {},
};

export const LoginSlice = createSlice({
  name: 'login',
  initialState,
  extraReducers: {
    [LoginAsync.pending]: (state) => {
      state.status = 'loading';
    },
    [LoginAsync.fulfilled]: (state, action) => {
      state.status = 'idle';
      state.LoginResponse = action.payload;
    },
    [LoginAsync.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [SsoLoginAsync.pending]: (state) => {
      state.status = 'loading';
    },
    [SsoLoginAsync.fulfilled]: (state, action) => {
      state.status = 'idle';
      state.LoginResponse = action.payload;
    },
    [SsoLoginAsync.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [GoogleLoginAsync.pending]: (state) => {
      state.status = 'loading';
    },
    [GoogleLoginAsync.fulfilled]: (state, action) => {
      state.status = 'idle';
      state.LoginResponse = action.payload;
    },
    [GoogleLoginAsync.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },

  },
});

export const selectLoginResponse = (state) => state.login.LoginResponse;
export const selectStatus = (state) => state.login.status;
export default LoginSlice.reducer;
