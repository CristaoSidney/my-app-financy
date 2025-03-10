import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Paper, Typography, TextField, Button, Backdrop, CircularProgress, Alert, MenuItem } from "@mui/material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/contra-cheque-rubrica";

export default function ContraChequeRubricaForm() {
  const [rubrica, setRubrica] = useState({ descricao: "", naturezaDaRubrica: "", valor: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { contraChequeId } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const handleChange = (e) => {
    setRubrica({ ...rubrica, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(API_URL, { ...rubrica, contraCheque: { id: contraChequeId } }, { headers });
      navigate(`/contra-cheque/edit/${contraChequeId}`);
    } catch (error) {
      setError("Erro ao salvar a rubrica. Verifique os campos e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Adicionar Rubrica ao ContraCheque
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField label="Descrição" name="descricao" value={rubrica.descricao} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Natureza" name="naturezaDaRubrica" value={rubrica.naturezaDaRubrica} onChange={handleChange} select fullWidth margin="normal" required>
          <MenuItem value="CREDITO">Crédito</MenuItem>
          <MenuItem value="DEBITO">Débito</MenuItem>
        </TextField>
        <TextField label="Valor" name="valor" value={rubrica.valor} onChange={handleChange} fullWidth margin="normal" required />
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "16px" }}>
          Salvar Rubrica
        </Button>
      </form>
      <Backdrop open={loading} style={{ zIndex: 1201, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
}
