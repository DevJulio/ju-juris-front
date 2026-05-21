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
    campoPesquisa: params.get('campoPesquisa') ?? '',
    numeroProcesso: params.get('numeroProcesso') ?? '',
    instancia: params.get('instancia') ?? '',
    area: params.get('area') ?? '',
    orgaoMateria: params.get('orgaoMateria') ?? '',
    unidade: params.get('unidade') ?? '',
    magistrado: params.get('magistrado') ?? '',
    tipoAto: params.get('tipoAto') ?? '',
    tipoAtoId: params.get('tipoAtoId') ?? '',
    dataInicio: params.get('dataInicio') ?? '',
    dataFim: params.get('dataFim') ?? '',
    quantidade: params.get('quantidade') ?? '10',
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

  const payload: JurisprudenciaFilters = {
    texto: f.texto || undefined,
    campoPesquisa: f.campoPesquisa || undefined,
    instancia: f.instancia || undefined,
    area: f.area || undefined,
    orgaoMateria: f.orgaoMateria || undefined,
    unidade: f.unidade || undefined,
    magistrado: f.magistrado || undefined,
    tipoAto: f.tipoAto || undefined,
    tipoAtoId: f.tipoAtoId || undefined,
    numeroProcesso: f.numeroProcesso || undefined,
    dataInicial: f.dataInicio ? fmt(f.dataInicio) : undefined,
    dataFinal: f.dataFim ? fmt(f.dataFim) : undefined,
    quantidade: f.quantidade ? Number(f.quantidade) : undefined,
  };

  const texto = f.texto?.trim();
  if (!texto) return payload;

  if (f.campoPesquisa === 'recursoProcCnj' && !payload.numeroProcesso) {
    payload.numeroProcesso = texto;
    payload.texto = undefined;
  }

  if (f.campoPesquisa === 'relator' && !payload.magistrado) {
    payload.magistrado = texto;
    payload.texto = undefined;
  }

  if (f.campoPesquisa === 'comarca' && !payload.unidade) {
    payload.unidade = texto;
    payload.texto = undefined;
  }

  if (f.campoPesquisa === 'dataAcordao' && !payload.dataInicial && !payload.dataFinal) {
    payload.dataInicial = fmt(texto);
    payload.dataFinal = fmt(texto);
    payload.texto = undefined;
  }

  if (f.campoPesquisa === 'ementa') {
    payload.tipoAto = 'Ementa';
    payload.tipoAtoId = '124';
  }

  if (f.campoPesquisa === 'decisao') {
    payload.tipoAto = 'Decisão';
    payload.tipoAtoId = '15';
  }

  return payload;
}


export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = filtersFromParams(searchParams);
  const pagina = pageFromParams(searchParams);
  const hasSearched = Array.from(searchParams.entries()).some(
    ([key, value]) => key !== 'quantidade' && key !== 'pagina' && value !== '',
  );

  const { data, isFetching, error } = useQuery({
    queryKey: ['jurisprudencia', filters, pagina],
    queryFn: () => buscarJurisprudencia({ ...toJurisprudenciaFilters(filters), pagina }),
    enabled: hasSearched,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const resultsPerPage = Number(filters.quantidade || RESULTS_PER_PAGE);
  const totalPages = data ? Math.min(Math.ceil(data.total / resultsPerPage), 10000) : 0;

  function handleSearch(f: SearchFilters) {
    const params: Record<string, string> = {};
    Object.entries(f).forEach(([k, v]) => {
      if (!v) return;
      if (k === 'quantidade' && v === '10') return;
      params[k] = v;
    });
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
