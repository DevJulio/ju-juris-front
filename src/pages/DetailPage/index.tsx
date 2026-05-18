import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from 'styled-components';
import { resultsCache } from '../../services/jujuris';

const Header = styled.header`
  background-color: #1a3a5c;
  color: white;
  padding: 24px 0;
  margin-bottom: 32px;
`;

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const numeroProcesso = id ? decodeURIComponent(id) : '';
  const resultado = resultsCache.get(numeroProcesso);

  return (
    <>
      <Header>
        <Container maxWidth="lg">
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Jujuris
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Consulta de Jurisprudência — TJGO
          </Typography>
        </Container>
      </Header>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Voltar
        </Button>

        {!resultado && (
          <Alert severity="warning">
            Resultado não encontrado. Volte à busca e acesse novamente.
          </Alert>
        )}

        {resultado && (
          <Paper variant="outlined" sx={{ p: 4 }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }}>
              <Chip label="TJGO" color="primary" />
              {resultado.tipoAto && (
                <Chip label={resultado.tipoAto} variant="outlined" />
              )}
            </Stack>

            <Typography variant="h6" gutterBottom>
              {resultado.numeroProcesso}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Unidade</Typography>
                <Typography>{resultado.unidade || '—'}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">Magistrado</Typography>
                <Typography>{resultado.magistrado || '—'}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">Publicado em</Typography>
                <Typography>{resultado.dataPublicacao || '—'}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Íntegra da Decisão
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                  fontFamily: 'Georgia, serif',
                  fontSize: '0.9rem',
                  bgcolor: '#fafafa',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  p: 3,
                }}
              >
                {resultado.textoDecisao}
              </Typography>
            </Box>
          </Paper>
        )}
      </Container>
    </>
  );
}
