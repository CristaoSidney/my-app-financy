import { Auth0Provider } from "@auth0/auth0-react";

const AuthProvider = ({ children }) => {
  
  return (
    <Auth0Provider
      domain="dev-e6tkv2b8tbmr4k5m.us.auth0.com"
      clientId="AlnVyav7HxNWT3Zgti3TG9aD81itMJCS"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://my-app-financy-backend.onrender.com/api",
        scope: "openid profile email"
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;