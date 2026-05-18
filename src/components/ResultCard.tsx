import { Card, CardContent, Chip, Stack, Typography, Box } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import type { JurisprudenciaResult } from '../types';

interface Props {
  resultado: JurisprudenciaResult;
}

export default function ResultCard({ resultado }: Props) {
  const navigate = useNavigate();
  const slug = encodeURIComponent(resultado.numeroProcesso);

  return (
    <Card
      elevation={0}
      sx={{
        cursor: 'pointer',
        border: '1px solid #e8eaed',
        borderRadius: 2,
        bgcolor: 'white',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.10)', borderColor: '#c0c8d4' },
      }}
      onClick={() => navigate(`/jurisprudencia/${slug}`)}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>

        {/* Linha 1: tipo de ato + data */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', flex: 1, gap: 0.5 }}>
            <Chip
              label="TJGO"
              size="small"
              sx={{ bgcolor: '#1a3a5c', color: 'white', fontWeight: 600 }}
            />
            {resultado.tipoAto && (
              <Chip label={resultado.tipoAto} size="small" variant="outlined" />
            )}
          </Stack>

          <Box sx={{ textAlign: 'right', ml: 2, flexShrink: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Publicado em
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {resultado.dataPublicacao || '—'}
            </Typography>
          </Box>
        </Box>

        {/* Número do processo */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: 0.5, mb: 0.5 }}
        >
          {resultado.numeroProcesso}
        </Typography>

        {/* Unidade + Magistrado */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {resultado.unidade || '—'}
        </Typography>
        {resultado.magistrado && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontStyle: 'italic' }}>
            {resultado.magistrado}
          </Typography>
        )}

        {/* Trecho da decisão */}
        {resultado.textoDecisao && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
              fontSize: '0.8rem',
            }}
          >
            {resultado.textoDecisao}
          </Typography>
        )}

        {/* Rodapé: ver íntegra */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            component="span"
            onClick={(e) => { e.stopPropagation(); navigate(`/jurisprudencia/${slug}`); }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.25,
              color: '#1a3a5c',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Ver Íntegra <ChevronRightIcon fontSize="small" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
