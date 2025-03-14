import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  Button, TextField, MenuItem, Paper, Typography, 
  Backdrop, CircularProgress 
} from "@mui/material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/conta-saldo";

export default function ContaSaldoForm() {
  const [conta, setConta] = useState({ nome: "", tipoDaContaSaldo: "", naturezaDaConta: "" });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAccessTokenSilently()
        .then((token) => axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } }))
        .then((response) => setConta(response.data))
        .catch((error) => console.error("Erro ao buscar dados:", error))
        .finally(() => setLoading(false));
    }
  }, [id, getAccessTokenSilently]);

  const handleChange = (e) => {
    setConta({ ...conta, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const headers = { Authorization: `Bearer ${token}` };

      if (id) {
        await axios.put(`${API_URL}/${id}`, conta, { headers });
      } else {
        await axios.post(API_URL, conta, { headers });
      }
      navigate("/conta-saldo");
    } catch (error) {
      console.error("Erro ao salvar:", error);
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
          {id ? "Editar Conta" : "Criar Conta"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            name="nome"
            value={conta.nome}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Tipo"
            name="tipoDaContaSaldo"
            value={conta.tipoDaContaSaldo}
            onChange={handleChange}
            select
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="CONTA_CORRENTE">Conta Corrente</MenuItem>
            <MenuItem value="CAIXA">Caixa</MenuItem>
            <MenuItem value="APLICATIVO">Aplicativo</MenuItem>
            <MenuItem value="INVESTIMENTO">Investimento</MenuItem>
            <MenuItem value="CARTAO">Cartão</MenuItem>
          </TextField>
          <TextField
            label="Natureza"
            name="naturezaDaConta"
            value={conta.naturezaDaConta}
            onChange={handleChange}
            select
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="CREDITO">Crédito</MenuItem>
            <MenuItem value="DEBITO">Débito</MenuItem>
          </TextField>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            style={{ marginTop: "16px" }} 
            disabled={loading}
          >
            {id ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </Paper>
    </>
  );
}