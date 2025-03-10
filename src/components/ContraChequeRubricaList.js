import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Backdrop, CircularProgress, Alert } from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/contra-cheque";

export default function ContraChequeRubricaList() {
  const [rubricas, setRubricas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { contraChequeId } = useParams();

  useEffect(() => {
    async function fetchRubricas() {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${API_URL}/${contraChequeId}/rubricas`, { headers: { Authorization: `Bearer ${token}` } });
        setRubricas(response.data);
      } catch (error) {
        setError("Erro ao carregar as rubricas.");
      } finally {
        setLoading(false);
      }
    }
    fetchRubricas();
  }, [getAccessTokenSilently, contraChequeId]);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta rubrica?")) {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        await axios.delete(`${API_URL}/${contraChequeId}/rubricas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setRubricas(rubricas.filter((r) => r.id !== id));
      } catch (error) {
        setError("Erro ao excluir a rubrica.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom style={{ padding: "16px" }}>
        Rubricas do Contra-Cheque {contraChequeId}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Natureza</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rubricas.map((rubrica) => (
            <TableRow key={rubrica.id}>
              <TableCell>{rubrica.id}</TableCell>
              <TableCell>{rubrica.descricao}</TableCell>
              <TableCell>{rubrica.naturezaDaRubrica}</TableCell>
              <TableCell>{rubrica.valor}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => navigate(`/contra-cheque/${contraChequeId}/rubricas/edit/${rubrica.id}`)} aria-label="editar">
                  <Edit />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDelete(rubrica.id)} aria-label="excluir">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <IconButton color="primary" style={{ margin: "16px" }} onClick={() => navigate(`/contra-cheque/${contraChequeId}/rubricas/create`)} aria-label="adicionar">
        <Add />
      </IconButton>
      <Backdrop open={loading} style={{ zIndex: 1201, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </TableContainer>
  );
}
