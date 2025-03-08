import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography, IconButton, Backdrop, CircularProgress 
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/sub-contas";

export default function SubContaList() {
  const [subContas, setSubContas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSubContas() {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
        setSubContas(response.data);
      } catch (error) {
        console.error("Erro ao buscar subcontas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubContas();
  }, [getAccessTokenSilently]);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta subconta?")) {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setSubContas(subContas.filter((subConta) => subConta.id !== id));
      } catch (error) {
        console.error("Erro ao excluir subconta:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 1201, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <TableContainer component={Paper} style={{ opacity: loading ? 0.5 : 1 }}>
        <Typography variant="h6" gutterBottom style={{ padding: "16px" }}>
          Subcontas
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Natureza</TableCell>
              <TableCell>Grupo de Contas</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subContas.map((subConta) => (
              <TableRow key={subConta.id}>
                <TableCell>{subConta.id}</TableCell>
                <TableCell>{subConta.descricao}</TableCell>
                <TableCell>{subConta.naturezaDaConta}</TableCell>
                <TableCell>{subConta.grupoContas?.descricao || "N/A"}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => navigate(`/sub-conta/edit/${subConta.id}`)} aria-label="editar">
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(subConta.id)} aria-label="excluir">
                    <Delete />
                  </IconButton>                
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <IconButton color="primary" style={{ margin: "16px" }} onClick={() => navigate("/sub-conta/create")} aria-label="adicionar">
          <Add />
        </IconButton>      
      </TableContainer>
    </>
  );
}
