import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Paper, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import styled from 'styled-components';
import SearchForm from '../../components/SearchForm';
import ResultsList from '../../components/ResultsList';
import { buscarJurisprudencia } from '../../services/jujuris';
import type { SearchFilters, JurisprudenciaFilters } from '../../types';

const Header = styled.header`
  background-color: #1a3a5c;
  color: white;
  padding: 40px 16px;
  margin-bottom: 0;
  text-align: center;
  width: 100%;
`;

const RESULTS_PER_PAGE = 10;

function filtersFromParams(params: URLSearchParams): SearchFilters {
  return {
    texto: params.get('texto') ?? '',
    numeroProcesso: params.get('numeroProcesso') ?? '',
    grau: params.get('grau') ?? '',
    classeNome: params.get('classeNome') ?? '',
    orgaoJulgador: params.get('orgaoJulgador') ?? '',
    dataInicio: params.get('dataInicio') ?? '',
    dataFim: params.get('dataFim') ?? '',
  };
}

function pageFromParams(params: URLSearchParams): number {
  const p = parseInt(params.get('pagina') ?? '1', 10);
  return isNaN(p) || p < 1 ? 1 : p;
}

function toJurisprudenciaFilters(f: SearchFilters): JurisprudenciaFilters {
  // Converte yyyy-mm-dd → dd/mm/yyyy para o PROJUDI
  const fmt = (d: string) =>
    d.length === 10 && d[4] === '-'
      ? `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`
      : d;
  return {
    texto: f.texto || undefined,
    numeroProcesso: f.numeroProcesso || undefined,
    dataInicial: f.dataInicio ? fmt(f.dataInicio) : undefined,
    dataFinal: f.dataFim ? fmt(f.dataFim) : undefined,
  };
}


export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = filtersFromParams(searchParams);
  const pagina = pageFromParams(searchParams);
  const hasSearched = Array.from(searchParams.values()).some(v => v !== '');

  const { data, isFetching, error } = useQuery({
    queryKey: ['jurisprudencia', filters, pagina],
    queryFn: () => buscarJurisprudencia({ ...toJurisprudenciaFilters(filters), pagina }),
    enabled: hasSearched,
    staleTime: 5 * 60 * 1000,
  });

  const totalPages = data ? Math.min(Math.ceil(data.total / RESULTS_PER_PAGE), 10000) : 0;

  function handleSearch(f: SearchFilters) {
    const params: Record<string, string> = {};
    Object.entries(f).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params); // reseta para página 1 em nova busca
  }

  function handlePageChange(_: React.ChangeEvent<unknown>, page: number) {
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { if (k !== 'pagina') params[k] = v; });
    if (page > 1) params.pagina = String(page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      <Header>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
          Jujuris
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.75, mt: 0.5, color: 'white' }}>
          Consulta de Jurisprudência — TJGO
        </Typography>
      </Header>

      <Box sx={{ maxWidth: 960, mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            borderTop: '3px solid #e91e8c',
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
            Pesquisar Jurisprudência
          </Typography>
          <SearchForm onSearch={handleSearch} loading={isFetching} initialValues={filters} />
        </Paper>

        {hasSearched && (
          <Box sx={{ pb: 6 }}>
            <ResultsList
              results={data?.resultados ?? []}
              total={data?.total ?? 0}
              loading={isFetching}
              error={error as Error | null}
              tempoResposta={data?.tempoResposta}
            />
            {totalPages > 1 && !isFetching && !error && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={pagina}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  siblingCount={2}
                  sx={{
                    '& .MuiPaginationItem-root': { borderRadius: 1 },
                    '& .Mui-selected': { bgcolor: '#1a3a5c !important', color: 'white' },
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
