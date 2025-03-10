import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Backdrop, CircularProgress, Alert } from "@mui/material";
import { Delete, Edit, Add, List, PlaylistAdd } from "@mui/icons-material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/contra-cheque";

export default function ContraChequeList() {
  const [contraCheques, setContraCheques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchContraCheques() {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
        setContraCheques(response.data);
      } catch (error) {
        setError("Erro ao carregar os dados dos ContraCheques.");
      } finally {
        setLoading(false);
      }
    }
    fetchContraCheques();
  }, [getAccessTokenSilently]);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este ContraCheque?")) {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setContraCheques(contraCheques.filter((contraCheque) => contraCheque.id !== id));
      } catch (error) {
        setError("Erro ao excluir o ContraCheque.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom style={{ padding: "16px" }}>
        ContraCheques
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Mês</TableCell>
            <TableCell>Ano</TableCell>
            <TableCell>FGTS</TableCell>
            <TableCell>Auxílio Alimentação</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contraCheques.map((contraCheque) => (
            <TableRow key={contraCheque.id}>
              <TableCell>{contraCheque.id}</TableCell>
              <TableCell>{contraCheque.mes}</TableCell>
              <TableCell>{contraCheque.ano}</TableCell>
              <TableCell>{contraCheque.fgts}</TableCell>
              <TableCell>{contraCheque.valorAuxilioAlimentacao}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => navigate(`/contra-cheque/edit/${contraCheque.id}`)} aria-label="editar">
                  <Edit />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDelete(contraCheque.id)} aria-label="excluir">
                  <Delete />
                </IconButton>
                <IconButton color="default" onClick={() => navigate(`/contra-cheque/${contraCheque.id}/add-rubrica`)} aria-label="adicionar rubrica">
                  <PlaylistAdd />
                </IconButton>
                <IconButton color="default" onClick={() => navigate(`/contra-cheque/${contraCheque.id}/rubricas`)} aria-label="listar rubricas">
                  <List />
                </IconButton>                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <IconButton color="primary" style={{ margin: "16px" }} onClick={() => navigate("/contra-cheque/create")} aria-label="adicionar">
        <Add />
      </IconButton>
      <Backdrop open={loading} style={{ zIndex: 1201, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </TableContainer>
  );
}
