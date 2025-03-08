import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Toolbar, Button, Typography, Container, Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import GrupoConta from './components/GrupoConta';
import SubConta from './components/SubConta';
import Home from './pages/Home';

export default function AppAuth() {
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
              User CRUD
            </Typography>
            {!isAuthenticated ? (
              <Button color="inherit" onClick={() => loginWithRedirect()}>
                Login
              </Button>
            ) : (
              <>
                <Typography variant="body1" style={{ marginRight: "16px" }}>
                  Hello, {user.name}
                </Typography>
                <Button color="inherit" onClick={() => logout({ returnTo: window.location.origin })}>
                  Logout
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        {isAuthenticated ? (
          <>
            {/* Menu Lateral */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
              <List>
                <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/grupo-conta" onClick={toggleDrawer(false)}>
                  <ListItemText primary="Grupo Conta" />
                </ListItem>
                <ListItem button component={Link} to="/sub-conta" onClick={toggleDrawer(false)}>
                  <ListItemText primary="SubConta" />
                </ListItem>
              </List>
            </Drawer>

            {/* Estrutura de Rotas */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/grupo-conta" element={<GrupoConta />} />
              <Route path="/sub-conta" element={<SubConta />} />
            </Routes>
          </>
        ) : (
          <Typography variant="body1" color="textSecondary" align="center" style={{ marginTop: "20px" }}>
            Please log in to access the system.
          </Typography>
        )}
      </Container>
    </Router>
  );
}
