import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  Button, TextField, MenuItem, Paper, Typography, 
  Backdrop, CircularProgress, Alert 
} from "@mui/material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/sub-conta";
const API_GRUPO_URL = "https://my-app-financy-backend.onrender.com/api/grupo-contas";

export default function SubContaForm() {
  const [subConta, setSubConta] = useState({ descricao: "", naturezaDaConta: "", grupoContas: "" });
  const [grupos, setGrupos] = useState([]);
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
        
        // Buscar grupos de contas para seleção
        const gruposResponse = await axios.get(API_GRUPO_URL, { headers: { Authorization: `Bearer ${token}` } });
        setGrupos(gruposResponse.data);

        // Se for edição, buscar a subconta
        if (id) {
          const subContaResponse = await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          setSubConta(subContaResponse.data);
          console.log(subContaResponse.data);
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
    setSubConta({ ...subConta, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const token = await getAccessTokenSilently();
      const headers = { Authorization: `Bearer ${token}` };

      if (id) {
        await axios.put(`${API_URL}/${id}`, subConta, { headers });
      } else {
        await axios.post(API_URL, subConta, { headers });
      }
      navigate("/sub-conta");
    } catch (error) {
      console.error("Erro ao salvar subconta:", error);
      if (error.response) {
        setError(error.response.data.message || "Erro no servidor. Tente novamente.");
      } else {
        setError("Erro ao conectar com o servidor.");
      }      
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
          {id ? "Editar SubConta" : "Criar SubConta"}
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
            value={subConta.descricao}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Natureza"
            name="naturezaDaConta"
            value={subConta.naturezaDaConta}
            onChange={handleChange}
            select
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="CREDITO">Crédito</MenuItem>
            <MenuItem value="DEBITO">Débito</MenuItem>
          </TextField>
          <TextField
            label="Grupo de Contas"
            name="grupoContas"
            value={subConta.grupoContas.descricao}
            onChange={handleChange}
            select
            fullWidth
            margin="normal"
            required
          >
            {grupos.map((grupo) => (
              <MenuItem key={grupo.id} value={grupo.id}>{grupo.descricao}</MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "16px" }} disabled={loading}>
            {id ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </Paper>
    </>
  );
}
