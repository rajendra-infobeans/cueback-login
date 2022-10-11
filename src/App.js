import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from './styles/colors';
import { routes } from './navigator/routes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './features/login/Login';
import AppLayout from './components/AppLayout'

const App = () => {
  return (
    <>
    <BrowserRouter>
    <AppLayout />
        <Routes>
            <Route path="/" element={
                    <ThemeProvider theme={theme}>
                    <Login />
                  </ThemeProvider>
            } />
            <Route path="/auth/login" element={
              <ThemeProvider theme={theme}>
                <Login />
              </ThemeProvider>
            
            } />
        </Routes>
        {/* </AppLayout> */}
    </BrowserRouter>
    </>
  );
}

export default App;
