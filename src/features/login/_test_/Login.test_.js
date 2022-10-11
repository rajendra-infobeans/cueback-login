import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';
import { Provider } from 'react-redux';
import { store } from '../../../app/Store';
import { ThemeProvider } from 'styled-components';
import theme from '../../../styles/colors';
import 'jest-styled-components';

describe('login component test', () => {
  test('Export correctly', () => {
    expect(Login).toBeDefined();
  });

  test('Login Should we render one time', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
    expect(render.length).toBe(1);
  });

  test('component should have content', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    );
    expect(asFragment()).not.toBeNull();
    expect(screen.queryByTestId('LoginPage')).not.toBeNull();
  });

  test('component should have Image', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.queryByTestId('LoginImage')).not.toBeNull();
  });
  test('component should render email input filed', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.queryByTestId('EmailField')).toBeNull();
  });

  test('component should render email password filed', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.queryByTestId('PasswordField')).toBeNull();
  });
  test('component should render Login Form', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.queryByTestId('LoginForm')).not.toBeNull();
  });

  test('login component renders', () => {
    const { container } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    );
    const login = container.querySelector('.login');
    expect(login).toBeInstanceOf(HTMLDivElement);
  });

  test('check text rendring ', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getAllByText('Login')).toMatchSnapshot();
    expect(screen.getAllByText('Continue with Google')).toMatchSnapshot();
    expect(screen.getAllByText('Join waitlist')).toMatchSnapshot();
    expect(screen.getAllByText('or')).toMatchSnapshot();
    expect(screen.getAllByText('Don\'t have access yet?')).toMatchSnapshot();
    expect(screen.getAllByText('Email')).toMatchSnapshot();
    expect(screen.getAllByText('Password')).toMatchSnapshot();
  });

  test('Check Login Button Click', () => {
    const mockOnClick = jest.fn();
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    );
    const login_button = screen.getByTestId('LoginButton');
    login_button.onclick = mockOnClick;
    fireEvent.click(login_button);
    expect(mockOnClick).toBeCalledTimes(1);
  });

  test('Check Login Button Style', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    );
    const login_button = screen.getByTestId('LoginButton');
    expect(login_button).toHaveStyleRule(
      'background',
      `${theme.buttonPrimaryBg}`
    );
    expect(login_button).toHaveStyleRule(
      'color',
      `rgb( ${theme.colors.white} )`
    );
  });

  test('Google Button Click', () => {
    const mockOnClick = jest.fn();
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    );
    const google_Button = screen.getByTestId('GoogleButton');
    google_Button.onclick = mockOnClick;
    fireEvent.click(google_Button);
    expect(mockOnClick).toBeCalledTimes(1);
  });

  test('Check Google Button Style', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    );
    const google_Button = screen.getByTestId('GoogleButton');
    expect(google_Button).toHaveStyleRule(
      'background',
      `${theme.pageTextListNumberBg}`
    );
    expect(google_Button).toHaveStyleRule(
      'color',
      `rgb( ${theme.colors.neutral200} )`
    );
  });
});
