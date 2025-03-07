import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/grupo-conta">GrupoConta</Button>
        <Button color="inherit" component={Link} to="/sub-conta">SubConta</Button>
        {isAuthenticated ? (
          <Button color="inherit" onClick={() => logout({ returnTo: window.location.origin })}>Logout</Button>
        ) : (
          <Button color="inherit" onClick={() => loginWithRedirect()}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;