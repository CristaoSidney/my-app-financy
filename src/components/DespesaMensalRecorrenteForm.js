import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  Button, TextField, MenuItem, Paper, Typography, 
  Backdrop, CircularProgress, Alert, FormControl, InputLabel, Select
} from "@mui/material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/despesa-mensal-recorrente";
const API_CONTA_SALDO_URL = "https://my-app-financy-backend.onrender.com/api/conta-saldo";
const API_GRUPO_CONTAS_URL = "https://my-app-financy-backend.onrender.com/api/grupo-contas";
const API_SUBCONTA_URL = "https://my-app-financy-backend.onrender.com/api/sub-conta";

export default function DespesaMensalForm() {
  const [despesa, setDespesa] = useState({ descricao: "", valor: "", diaDoVencimento: "", contaSaldo: "", grupoContas: "", subConta: "" });
  const [contasSaldo, setContasSaldo] = useState([]);
  const [gruposContas, setGruposContas] = useState([]);
  const [subContas, setSubContas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const token = await getAccessTokenSilently();
        
        const [contaRes, grupoRes, subRes] = await Promise.all([
          axios.get(API_CONTA_SALDO_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(API_GRUPO_CONTAS_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(API_SUBCONTA_URL, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setContasSaldo(contaRes.data);
        setGruposContas(grupoRes.data);
        setSubContas(subRes.data);

        if (id) {
          const despesaRes = await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          setDespesa(despesaRes.data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Falha ao carregar os dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, getAccessTokenSilently]);

  const handleChange = (e) => {
    setDespesa({ ...despesa, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const headers = { Authorization: `Bearer ${token}` };

      if (id) {
        await axios.put(`${API_URL}/${id}`, despesa, { headers });
      } else {
        await axios.post(API_URL, despesa, { headers });
      }
      navigate("/despesa-mensal");
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      setError(error.response?.data?.message || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 1201, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper style={{ padding: "16px", maxWidth: "600px", margin: "0 auto", opacity: loading ? 0.5 : 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {id ? "Editar Despesa Mensal Recorrente" : "Criar Despesa Mensal Recorrente"}
        </Typography>
        {error && (
          <Alert severity="error" style={{ marginBottom: "16px" }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField label="Descrição" name="descricao" value={despesa.descricao} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Valor" name="valor" type="number" value={despesa.valor} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Dia do Vencimento" name="diaDoVencimento" type="number" value={despesa.diaDoVencimento} onChange={handleChange} fullWidth margin="normal" required />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Conta Saldo</InputLabel>
            <Select name="contaSaldo" value={despesa.contaSaldo} onChange={handleChange}>
              {contasSaldo.map(conta => <MenuItem key={conta.id} value={conta.id}>{conta.nome}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Grupo Contas</InputLabel>
            <Select name="grupoContas" value={despesa.grupoContas} onChange={handleChange}>
              {gruposContas.map(grupo => <MenuItem key={grupo.id} value={grupo.id}>{grupo.descricao}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>SubConta</InputLabel>
            <Select name="subConta" value={despesa.subConta} onChange={handleChange}>
              {subContas.map(sub => <MenuItem key={sub.id} value={sub.id}>{sub.descricao}</MenuItem>)}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "16px" }} disabled={loading}>
            {id ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </Paper>
    </>
  );
}
