import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, TextField, MenuItem, Paper, Typography } from "@mui/material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/grupo-contas";

export default function GrupoContaForm() {
  const [grupoConta, setGrupoConta] = useState({ descricao: "", naturezaDaConta: "" });
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (id) {
      getAccessTokenSilently().then((token) => {
        axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => setGrupoConta(response.data));
      });
    }
  }, [id, getAccessTokenSilently]);

  const handleChange = (e) => {
    setGrupoConta({ ...grupoConta, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    const headers = { Authorization: `Bearer ${token}` };

    if (id) {
      await axios.put(`${API_URL}/${id}`, grupoConta, { headers });
    } else {
      await axios.post(API_URL, grupoConta, { headers });
    }
    navigate("/grupo-conta");
  };

  return (
    <Paper style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {id ? "Editar Grupo de Conta" : "Criar Grupo de Conta"}
      </Typography>
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
          <MenuItem value="RECEITA">Receita</MenuItem>
          <MenuItem value="DESPESA">Despesa</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "16px" }}>
          {id ? "Atualizar" : "Criar"}
        </Button>
      </form>
    </Paper>
  );
}
