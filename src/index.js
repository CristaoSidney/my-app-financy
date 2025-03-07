import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

const domain = "dev-e6tkv2b8tbmr4k5m.us.auth0.com";
const clientId = "AlnVyav7HxNWT3Zgti3TG9aD81itMJCS";

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
    audience={"https://my-app-financy-backend.onrender.com/api"}
    scope={"openid profile email"}    
  >
    <Router>
      <App />
    </Router>
  </Auth0Provider>,
  document.getElementById('root')
);
