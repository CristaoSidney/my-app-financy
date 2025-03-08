import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import GrupoContaList from "./GrupoContaList";
import GrupoContaForm from "./GrupoContaForm";
import SubContaList from "./SubContaList";
import SubContaForm from "./SubContaForm";

export default function Menu({ open, toggleDrawer }) {
  return (
    <>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grupo-conta" element={<GrupoContaList />} />
        <Route path="/grupo-conta/create" element={<GrupoContaForm />} />
        <Route path="/grupo-conta/edit/:id" element={<GrupoContaForm />} />
        <Route path="/sub-conta" element={<SubContaList />} />
        <Route path="/sub-conta/create" element={<SubContaForm />} />
        <Route path="/sub-conta/edit/:id" element={<SubContaForm />} />
      </Routes>
    </>
  );
}
