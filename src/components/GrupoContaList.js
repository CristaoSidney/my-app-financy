import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography, IconButton, Backdrop, CircularProgress, Alert 
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/grupo-contas";

export default function GrupoContaList() {
  const [grupoContas, setGrupoContas] = useState([]);
  const [loading, setLoading] = useState(true);  // Estado para indicar carregamento
  const [error, setError] = useState("");
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGrupoContas() {
      setLoading(true);  // Inicia o carregamento
      setError("");
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
        setGrupoContas(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Falha ao carregar Grupo de Contas. Tente novamente.");
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    }
    fetchGrupoContas();
  }, [getAccessTokenSilently]);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este grupo?")) {
      setLoading(true);  // Ativa o loading ao excluir
      setError("");
      try {
        const token = await getAccessTokenSilently();
        await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setGrupoContas(grupoContas.filter((grupo) => grupo.id !== id));
      } catch (error) {
        console.error("Erro ao excluir:", error);
        setError("Erro ao excluir Grupo de Contas. Tente novamente.");
      } finally {
        setLoading(false);  // Desativa o loading
      }
    }
  };

  return (
    <>
      {/* Backdrop para indicar carregamento */}
      <Backdrop open={loading} style={{ zIndex: 1201, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <TableContainer component={Paper} style={{ opacity: loading ? 0.5 : 1 }}>
        <Typography variant="h6" gutterBottom style={{ padding: "16px" }}>
          Grupo de Contas
        </Typography>
        {/* Exibir erro caso exista */}
        {error && (
          <Alert severity="error" style={{ margin: "16px" }}>
            {error}
          </Alert>
        )}         
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
                  <IconButton color="primary" onClick={() => navigate(`/grupo-conta/edit/${grupo.id}`)} aria-label="editar">
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(grupo.id)} aria-label="excluir">
                    <Delete />
                  </IconButton>                
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <IconButton color="primary" style={{ margin: "16px" }} onClick={() => navigate("/grupo-conta/create")} aria-label="adicionar">
          <Add />
        </IconButton>      
      </TableContainer>
    </>
  );
}