import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import GrupoContaList from "./GrupoContaList";
import GrupoContaForm from "./GrupoContaForm";
import SubContaList from "./SubContaList";
import SubContaForm from "./SubContaForm";
import ContraChequeForm from "./ContraChequeForm";
import ContraChequeList from "./ContraChequeList";
import ContraChequeRubricaForm from "./ContraChequeRubricaForm";
import ContraChequeRubricaList from "./ContraChequeRubricaList";
import ContaSaldoForm from "./ContaSaldoForm";
import ContaSaldoList from "./ContaSaldoList";
import DespesaMensalRecorrenteForm from "./DespesaMensalRecorrenteForm";
import DespesaMensalRecorrenteList from "./DespesaMensalRecorrenteList";

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
          <ListItem button component={Link} to="/contra-cheque" onClick={toggleDrawer(false)}>
            <ListItemText primary="Contra Cheque" />
          </ListItem>
          <ListItem button component={Link} to="/conta-saldo" onClick={toggleDrawer(false)}>
            <ListItemText primary="Conta Saldo" />
          </ListItem>
          <ListItem button component={Link} to="/despesa-mensal" onClick={toggleDrawer(false)}>
            <ListItemText primary="Despesa Mensal" />
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
        <Route path="/contra-cheque" element={<ContraChequeList />} />
        <Route path="/contra-cheque/create" element={<ContraChequeForm />} />
        <Route path="/contra-cheque/edit/:id" element={<ContraChequeForm />} />
        <Route path="/contra-cheque/:contraChequeId/add-rubrica" element={<ContraChequeRubricaForm />} />      
        <Route path="/contra-cheque/:contraChequeId/rubricas" element={<ContraChequeRubricaList />} />      
        <Route path="/contra-cheque/:contraChequeId/rubricas/edit/:rubrica.id" element={<ContraChequeRubricaForm />} />      
        <Route path="/contra-cheque/:contraChequeId/rubricas/create" element={<ContraChequeRubricaForm />} />      
        <Route path="/conta-saldo" element={<ContaSaldoList />} />
        <Route path="/conta-saldo/create" element={<ContaSaldoForm />} />
        <Route path="/conta-saldo/edit/:id" element={<ContaSaldoForm />} />
        <Route path="/despesa-mensal" element={<DespesaMensalRecorrenteList />} />
        <Route path="/despesa-mensal/create" element={<DespesaMensalRecorrenteForm />} />
        <Route path="/despesa-mensal/edit/:id" element={<DespesaMensalRecorrenteForm />} />
      </Routes>
    </>
  );
}
