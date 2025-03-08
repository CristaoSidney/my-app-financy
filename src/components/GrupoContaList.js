import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";
import { IconButton } from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const API_URL = "https://my-app-financy-backend.onrender.com/api/grupo-contas";

export default function GrupoContaList() {
  const [grupoContas, setGrupoContas] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGrupoContas() {
      const token = await getAccessTokenSilently();
      const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setGrupoContas(response.data);
    }
    fetchGrupoContas();
  }, [getAccessTokenSilently]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      const token = await getAccessTokenSilently();
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setGrupoContas(grupoContas.filter((grupo) => grupo.id !== id));
    }
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom style={{ padding: "16px" }}>
        Grupo de Contas
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Natureza</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grupoContas.map((grupo) => (
            <TableRow key={grupo.id}>
              <TableCell>{grupo.id}</TableCell>
              <TableCell>{grupo.descricao}</TableCell>
              <TableCell>{grupo.naturezaDaConta}</TableCell>
              <TableCell>
                <IconButton variant="contained" color="primary" onClick={() => navigate(`/grupo-conta/edit/${grupo.id}`)} style={{ marginRight: "8px" }} aria-label="editar">
                    <Edit />
                </IconButton>
                <IconButton variant="contained" color="secondary"  onClick={() => handleDelete(grupo.id)} aria-label="excluir">
                    <Delete />
                </IconButton>                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <IconButton variant="contained" color="primary" style={{ margin: "16px" }} onClick={() => navigate("/grupo-conta/create")} aria-label="adicionar">
        <Add />
      </IconButton>      
    </TableContainer>
  );
}
