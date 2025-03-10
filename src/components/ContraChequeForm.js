import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Paper, Typography, TextField, Button, Backdrop, CircularProgress, Alert } from "@mui/material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/contra-cheque";

export default function ContraChequeForm() {
  const [contraCheque, setContraCheque] = useState({ mes: "", ano: "", fgts: "", valorAuxilioAlimentacao: "", isOrcamento: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAccessTokenSilently()
        .then((token) => axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } }))
        .then((response) => setContraCheque(response.data))
        .catch((error) => setError("Erro ao carregar os dados do ContraCheque."))
        .finally(() => setLoading(false));
    }
  }, [id, getAccessTokenSilently]);

  const handleChange = (e) => {
    setContraCheque({ ...contraCheque, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const headers = { Authorization: `Bearer ${token}` };
      if (id) {
        await axios.put(`${API_URL}/${id}`, contraCheque, { headers });
      } else {
        await axios.post(API_URL, contraCheque, { headers });
      }
      navigate("/contra-cheque");
    } catch (error) {
      setError("Erro ao salvar os dados. Verifique os campos e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {id ? "Editar ContraCheque" : "Criar ContraCheque"}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField label="Mês" name="mes" value={contraCheque.mes} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Ano" name="ano" value={contraCheque.ano} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="FGTS" name="fgts" value={contraCheque.fgts} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Auxílio Alimentação" name="valorAuxilioAlimentacao" value={contraCheque.valorAuxilioAlimentacao} onChange={handleChange} fullWidth margin="normal" required />
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "16px" }}>
          {id ? "Atualizar" : "Criar"}
        </Button>
      </form>
      <Backdrop open={loading} style={{ zIndex: 1201, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
}
