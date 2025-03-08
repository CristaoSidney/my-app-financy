import { BrowserRouter as Router } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Toolbar, Button, Typography, Container, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import AccountMenu from './components/AccountMenu';
import Menu from './components/Menu';


export default function App() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <Router>
      <Container>
        <AppBar position="static">
          <Toolbar>
            {isAuthenticated && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              My App Financy
            </Typography>
            {!isAuthenticated ? (
              <Button color="inherit" onClick={() => loginWithRedirect()}>
                Login
              </Button>
            ) : (
              <>
                <AccountMenu onLogout={() => logout({ returnTo: window.location.origin })} />
              </>
            )}
          </Toolbar>
        </AppBar>

        {isAuthenticated ? (
          <Menu open={drawerOpen} toggleDrawer={toggleDrawer} />
        ) : (
          <Typography variant="body1" color="textSecondary" align="center" style={{ marginTop: "20px" }}>
            Please log in to access the system.
          </Typography>
        )}
      </Container>
    </Router>
  );
}
