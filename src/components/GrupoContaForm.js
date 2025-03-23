import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  Button, TextField, MenuItem, Paper, Typography, 
  Backdrop, CircularProgress, Alert 
} from "@mui/material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/grupo-contas";

export default function GrupoContaForm() {
  const [grupoConta, setGrupoConta] = useState({ descricao: "", naturezaDaConta: "" });
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (id) {
      setLoading(true); // Ativa loading ao buscar dados
      getAccessTokenSilently()
        .then((token) => axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } }))
        .then((response) => setGrupoConta(response.data))
        .catch((error) => console.error("Erro ao buscar dados:", error))
        .finally(() => setLoading(false)); // Desativa loading ao concluir
    }
  }, [id, getAccessTokenSilently]);

  const handleChange = (e) => {
    setGrupoConta({ ...grupoConta, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Ativa loading ao enviar o formulário
    try {
      const token = await getAccessTokenSilently();
      const headers = { Authorization: `Bearer ${token}` };

      if (id) {
        await axios.put(`${API_URL}/${id}`, grupoConta, { headers });
      } else {
        await axios.post(API_URL, grupoConta, { headers });
      }
      navigate("/grupo-conta");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      if (error.response) {
        setError(error.response.data.message || "Erro no servidor. Tente novamente.");
      } else {
        setError("Erro ao conectar com o servidor.");
      }       
    } finally {
      setLoading(false); // Desativa loading após requisição
    }
  };

  return (
    <>
      {/* Backdrop de carregamento */}
      <Backdrop open={loading} style={{ zIndex: 1201, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper style={{ padding: "16px", maxWidth: "600px", margin: "0 auto", opacity: loading ? 0.5 : 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {id ? "Editar Grupo de Conta" : "Criar Grupo de Conta"}
        </Typography>
        {error && (
          <Alert severity="error" style={{ marginBottom: "16px" }}>
            {error}
          </Alert>
        )}          
        <form onSubmit={handleSubmit}>
          <TextField
            label="Descrição"
            name="descricao"
            value={grupoConta.descricao}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Natureza"
            name="naturezaDaConta"
            value={grupoConta.naturezaDaConta}
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
            disabled={loading} // Desabilita o botão durante o carregamento
          >
            {id ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </Paper>
    </>
  );
}
