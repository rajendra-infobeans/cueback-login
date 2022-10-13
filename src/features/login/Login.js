/* eslint-disable max-len */
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LoginAsync,
  SsoLoginAsync,
  selectLoginResponse,
  selectStatus,
  GoogleLoginAsync,
} from '../../app/reducers/LoginSlice';
import Button from '../../components/Button';
import { SpinnerCircular } from 'spinners-react';
import theme from '../../styles/colors';
import styled from 'styled-components';
import { FiArrowRight } from 'react-icons/fi';
import { Body, Caption1, LargeTitle } from '../../styles/typography';
// import { StaticImage } from 'gatsby-plugin-image';
import { FaGoogle } from 'react-icons/fa';
import { GoogleLogin } from 'react-google-login';
import { routes } from '../../navigator/routes';
import Input from '../../components/Input';
import { setPageTitle } from '../../app/reducers/HeadSlice';
import { useFormik } from 'formik';
import { LoginValidate } from '../../util/functions';
import Whitelist from './components/Whitelist';
import { federatedSignIn } from '../../auth/cognitoAuth';
import Cookies from 'js-cookie';
import RedirectUrl from '../../components/Redirect';
const StaticImage = styled.img`
position: absolute;
width: inherit;
height: 100%;
`
const LoginImageWrapper = styled.div`
  position: fixed;
  width: 50vw;
  height: 100vh;
  height: -webkit-fill-available;

  @media screen and (max-width: 800px) {
    display: none;
  }
`;

const LoginFormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50vw;
  margin-left: 50vw;
  min-height: 100vh;
  min-height: -webkit-fill-available;

  @media screen and (max-width: 800px) {
    margin-left: 0;
    width: 100vw;
  }
`;

const LoginFormContainer = styled.form`
  display: grid;
  grid-auto-flow: row;
  gap: 32px;
  justify-content: stretch;
  padding: 48px 32px;
  box-sizing: border-box;
  width: 100%;
  max-width: 480px;
`;

const InputGroup = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: 24px;
`;

const StyledLink = styled(Link)`
  text-decoration: underline;
  color: rgb(${(props) => props.theme.colors.blue400});
`;

const StyledBody = styled(Body)`
  color: rgb(${(props) => props.theme.colors.neutral200});
  text-align: center;
`;

const DividerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 8px;
  padding: 0 8px;
  align-items: center;

  > ${Caption1} {
    text-transform: uppercase;
    color: rgb(${(props) => props.theme.colors.neutral200});
  }

  > div {
    height: 1px;
    background: rgb(${(props) => props.theme.colors.neutral100});
  }
`;

const ErrorMessage = styled(Caption1)`
  color: rgb(${(props) => props.theme.colors.error400});
  text-align: center;
  height: 1em;
  padding-bottom: 10px;
`;

const Login = (props) => {
  const dispatch = useDispatch();
  const [isValid, setIsValid] = React.useState(true);

  const [val, setVal] = React.useState(Object.keys(localStorage));
  const idToken = localStorage.getItem('CognitoIdentityServiceProvider.4ufoedd4so0jq9j8fd7k3oroua.' + localStorage.getItem('CognitoIdentityServiceProvider.4ufoedd4so0jq9j8fd7k3oroua.LastAuthUser') + '.idToken');
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    dispatch(setPageTitle('Login/Signup'));
    console.log('Logged In2')
  }, [dispatch]);
  const result = useSelector(selectLoginResponse);
  setTimeout(() => { setVal(Object.keys(localStorage)) }, [5000]);
  const status = useSelector(selectStatus);

  const clientId =
    '446254925953-l4rkm48721bbeja94glkgj57fh9v7dvv.apps.googleusercontent.com';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      if (process.env.REACT_APP_LOGIN_WHITELIST === 'TRUE') {
        if (Whitelist.includes(values.email)) {
          setIsValid(true);
          dispatch(LoginAsync(values));
        } else setIsValid(false);
      } else dispatch(LoginAsync(values));
    },
    validate: LoginValidate,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
  });
  let redirect;
  if (props.pathname) {
    redirect = decodeURIComponent(props.pathname);
  } else {
    redirect = routes.app.path;
  }

  const LoginWithGoogle = (provider) => {
    federatedSignIn(provider);
  };
  const GoogleLoginSuccess = (res) => {
    console.log('Login success');
    const Obj = {
      userDetails: {
        photo: res.profileObj.imageUrl,
        email: res.profileObj.email,
        familyName: res.profileObj.familyName,
        givenName: res.profileObj.givenName,
        name: res.profileObj.name,
        id: res.profileObj.googleId,
      },
      sso_type: 'Google',
    };
    if (process.env.REACT_APP_LOGIN_WHITELIST === 'TRUE') {
      if (Whitelist.includes(res.profileObj.email)) {
        setIsValid(true);
        dispatch(SsoLoginAsync(Obj));
      } else {
        setIsValid(false);
      }
    } else dispatch(SsoLoginAsync(Obj));
  }
  useEffect(() => {
    if (idToken) {
      dispatch(GoogleLoginAsync());
    }
  }, [dispatch, idToken])
  const GoogleLoginFailure = (res) => {
    console.log(res);
  };
  useEffect(() => {
    if (result && result.code === 200) {

      navigate(-1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  if (Cookies.get('idToken')) {
    navigate(-1);
    // Navigate(routes.app.path, { replace: true });
    return <></>;
  } else {
    return (
      <div className="login" data-testid="LoginPage">
        <LoginImageWrapper data-testid="LoginImage">
          <StaticImage
            src="https://images.unsplash.com/photo-1543075036-3d6ad4e7f7da?ixlib=rb-1.2.1&d=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1015&q=80"
            placeholder="blurred"
            loading="eager"
            alt={'Login Image'}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          />
        </LoginImageWrapper>
        <LoginFormWrapper data-testid="LoginForm">
          <LoginFormContainer onSubmit={formik.handleSubmit}>
            <LargeTitle>Login</LargeTitle>
            <InputGroup>
              <Input
                label="Email"
                placeholder="Enter your email..."
                name={'email'}
                errorMessage={formik.errors.email}
                data-testid="EmailField"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onValueChange={formik.handleChange}
                errorCondition={formik.touched.email && formik.errors.email}
              />
              <Input
                label="Password"
                placeholder="Enter your password..."
                name={'password'}
                type={'password'}
                data-testid="PasswordField"
                errorMessage={formik.errors.password}
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onValueChange={formik.handleChange}
                errorCondition={
                  formik.touched.password && formik.errors.password
                }
              />
            </InputGroup>
            <Button
              type="primary"
              disabled={status === 'loading' || !formik.isValid ? true : false}
              data-testid="LoginButton"
            >
              {status === 'loading' ? (
                <SpinnerCircular
                  size={24}
                  thickness={200}
                  speed={100}
                  color={`rgba(${theme.colors.white}, 1)`}
                  secondaryColor={`rgba( ${theme.colors.neutral600}, 1)`}
                />
              ) : (
                <>
                  Login <FiArrowRight />
                </>
              )}
            </Button>
            <ErrorMessage>
              {isValid ? (
                result &&
                  result.code !== 200 &&
                  status !== 'loading' ? (
                  result.message
                ) : (
                  ' '
                )
              ) : (
                <>
                  Looks like that email is not on our list. Please check
                  spelling, or join the waitlist to test this version. If
                  you've already joined, we'll contact you soon!
                </>
              )}
            </ErrorMessage>
            <StyledBody>
              Don't have access yet?{' '}
              <StyledLink to={'https://forms.gle/ktWsZe12fqkCT1386'}>
                Join waitlist
              </StyledLink>
            </StyledBody>
            <DividerContainer>
              <div />
              <Caption1>or</Caption1>
              <div />
            </DividerContainer>
            <InputGroup>
              {process.env.REACT_APP_NEW_API === 'TRUE' ? <Button onButtonClick={() => LoginWithGoogle('Google')}>
                <FaGoogle />
                Continue with Google
              </Button> : <GoogleLogin
                clientId={clientId}
                onSuccess={GoogleLoginSuccess}
                onFailure={GoogleLoginFailure}
                cookiePolicy={'single_host_origin'}
                render={(renderProps) => (
                  <Button
                    onButtonClick={renderProps.onClick}
                    data-testid="GoogleButton"
                  >
                    <FaGoogle />
                    Continue with Google
                  </Button>
                )}
              />}

            </InputGroup>
          </LoginFormContainer>
        </LoginFormWrapper>
      </div>
    );
  }
};
export default Login;
