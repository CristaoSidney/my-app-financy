import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography, IconButton, Backdrop, CircularProgress 
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

const API_URL = "https://my-app-financy-backend.onrender.com/api/conta-saldo";

export default function ContaSaldoList() {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchContas() {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
        setContas(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchContas();
  }, [getAccessTokenSilently]);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta conta?")) {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setContas(contas.filter((conta) => conta.id !== id));
      } catch (error) {
        console.error("Erro ao excluir:", error);
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
          Contas
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Natureza</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contas.map((conta) => (
              <TableRow key={conta.id}>
                <TableCell>{conta.id}</TableCell>
                <TableCell>{conta.nome}</TableCell>
                <TableCell>{conta.tipoDaContaSaldo}</TableCell>
                <TableCell>{conta.naturezaDaConta}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => navigate(`/conta-saldo/edit/${conta.id}`)} aria-label="editar">
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(conta.id)} aria-label="excluir">
                    <Delete />
                  </IconButton>                
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <IconButton color="primary" style={{ margin: "16px" }} onClick={() => navigate("/conta-saldo/create")} aria-label="adicionar">
          <Add />
        </IconButton>      
      </TableContainer>
    </>
  );
}