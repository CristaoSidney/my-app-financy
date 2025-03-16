import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton, Backdrop, CircularProgress, Alert,
  TextField, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/despesa-mensal-recorrente";
const API_CONTA_SALDO_URL = "https://my-app-financy-backend.onrender.com/api/conta-saldo";
const API_GRUPO_CONTAS_URL = "https://my-app-financy-backend.onrender.com/api/grupo-contas";
const API_SUBCONTA_URL = "https://my-app-financy-backend.onrender.com/api/sub-conta";


export default function DespesaMensalList() {
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [filtros, setFiltros] = useState({ contaSaldo: "", grupoContas: "", subConta: "", descricao: "" });
  const [contasSaldo, setContasSaldo] = useState([]);
  const [gruposContas, setGruposContas] = useState([]);
  const [subContas, setSubContas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const token = await getAccessTokenSilently();
        const [despesaRes, contaRes, grupoRes, subRes] = await Promise.all([
          axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(API_CONTA_SALDO_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(API_GRUPO_CONTAS_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(API_SUBCONTA_URL, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setDespesas(despesaRes.data);
        setContasSaldo(contaRes.data);
        setGruposContas(grupoRes.data);
        setSubContas(subRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Falha ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [getAccessTokenSilently]);

  const handleFiltroChange = (event) => {
    setFiltros({ ...filtros, [event.target.name]: event.target.value });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta despesa?")) {
      setLoading(true);
      setError("");
      try {
        const token = await getAccessTokenSilently();
        await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setDespesas(despesas.filter((despesa) => despesa.id !== id));
      } catch (error) {
        console.error("Erro ao excluir despesa:", error);
        setError("Erro ao excluir Despesa. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
  };

  const despesasFiltradas = despesas.filter(despesa =>
    (filtros.contaSaldo === "" || despesa.contaSaldo?.id === Number(filtros.contaSaldo)) &&
    (filtros.grupoContas === "" || despesa.grupoContas?.id === Number(filtros.grupoContas)) &&
    (filtros.subConta === "" || despesa.subConta?.id === Number(filtros.subConta)) &&
    (filtros.descricao === "" || despesa.descricao.toLowerCase().includes(filtros.descricao.toLowerCase()))
  );

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 1201, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {error && (
        <Alert severity="error" style={{ margin: "16px" }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper} style={{ opacity: loading ? 0.5 : 1 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <IconButton color="primary" onClick={() => navigate("/despesa-mensal/create")}>
            <Add />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Despesas Mensais Recorrentes
          </Typography>
        </div>
        <FormControl style={{ marginRight: 10, minWidth: 120 }}>
          <InputLabel>Conta Saldo</InputLabel>
          <Select name="contaSaldo" value={filtros.contaSaldo} onChange={handleFiltroChange}>
            <MenuItem value="">Todas</MenuItem>
            {contasSaldo.map(conta => <MenuItem key={conta.id} value={conta.id}>{conta.nome}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl style={{ marginRight: 10, minWidth: 120 }}>
          <InputLabel>Grupo Contas</InputLabel>
          <Select name="grupoContas" value={filtros.grupoContas} onChange={handleFiltroChange}>
            <MenuItem value="">Todos</MenuItem>
            {gruposContas.map(grupo => <MenuItem key={grupo.id} value={grupo.id}>{grupo.descricao}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl style={{ marginRight: 10, minWidth: 120 }}>
          <InputLabel>SubConta</InputLabel>
          <Select name="subConta" value={filtros.subConta} onChange={handleFiltroChange}>
            <MenuItem value="">Todas</MenuItem>
            {subContas.map(sub => <MenuItem key={sub.id} value={sub.id}>{sub.descricao}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField label="Descrição" name="descricao" value={filtros.descricao} onChange={handleFiltroChange} style={{ marginBottom: 20, marginLeft: 10 }} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Dia do Vencimento</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {despesasFiltradas.map(despesa => (
              <TableRow key={despesa.id}>
                <TableCell>{despesa.descricao}</TableCell>
                <TableCell>{despesa.valor.toFixed(2)}</TableCell>
                <TableCell>{despesa.diaDoVencimento}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => navigate(`/despesa-mensal/edit/${despesa.id}`)}><Edit /></IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(despesa.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
