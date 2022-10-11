import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './app/Store';
import App from './App';


ReactDOM.render(
  // <React.StrictMode>
   <Provider store={store}>
    <App />
   </Provider>,
  document.getElementById('root')
);
// export default LandingPage;