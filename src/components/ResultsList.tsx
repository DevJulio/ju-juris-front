import { Stack, Typography, Box, CircularProgress, Alert } from '@mui/material';
import ResultCard from './ResultCard';
import type { JurisprudenciaResult } from '../types';

interface Props {
  results: JurisprudenciaResult[];
  total: number;
  loading: boolean;
  error: Error | null;
  tempoResposta?: string;
}

export default function ResultsList({
  results,
  total,
  loading,
  error,
  tempoResposta,
}: Props) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Erro ao buscar resultados: {error.message}
      </Alert>
    );
  }

  if (results.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">Nenhum resultado encontrado.</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {/* Cabeçalho de resultados */}
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: 2, fontSize: '0.7rem' }}
        >
          Resultados
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {total.toLocaleString('pt-BR')} resultado{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
        </Typography>
        {tempoResposta && (
          <Typography variant="caption" color="text.secondary">
            Tempo de resposta: {tempoResposta}
          </Typography>
        )}
      </Box>

      {results.map((r) => (
        <ResultCard key={r.numeroProcesso} resultado={r} />
      ))}
    </Stack>
  );
}
