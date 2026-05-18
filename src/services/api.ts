import axios from 'axios';
import type { SearchFilters, SearchResult, Processo } from '../types';

const BASE_URL = import.meta.env.DEV
  ? '/datajud'
  : import.meta.env.VITE_DATAJUD_BASE_URL;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: import.meta.env.VITE_DATAJUD_API_KEY,
    'Content-Type': 'application/json',
  },
});

const INDEX = 'api_publica_tjgo';

export async function searchProcessos(
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 10,
  sortBy: 'data' | 'relevancia' = 'data'
): Promise<SearchResult> {
  const must: object[] = [];

  if (filters.texto) {
    must.push({ match: { 'assuntos.nome': filters.texto } });
  }

  if (filters.numeroProcesso) {
    must.push({ term: { numeroProcesso: filters.numeroProcesso.replace(/\D/g, '') } });
  }

  if (filters.grau) {
    must.push({ match: { grau: filters.grau } });
  }

  if (filters.classeNome) {
    must.push({ match: { 'classe.nome': filters.classeNome } });
  }

  if (filters.orgaoJulgador) {
    must.push({ match: { 'orgaoJulgador.nome': filters.orgaoJulgador } });
  }

  if (filters.dataInicio || filters.dataFim) {
    const range: Record<string, string> = {};
    if (filters.dataInicio) range.gte = filters.dataInicio;
    if (filters.dataFim) range.lte = filters.dataFim;
    must.push({ range: { dataAjuizamento: range } });
  }

  const query = must.length > 0 ? { bool: { must } } : { match_all: {} };

  const body = {
    query,
    from: (page - 1) * pageSize,
    size: pageSize,
    ...(sortBy === 'data' ? { sort: [{ dataAjuizamento: { order: 'desc' } }] } : {}),
    _source: [
      'numeroProcesso',
      'tribunal',
      'classe',
      'assuntos',
      'dataAjuizamento',
      'dataHoraUltimaAtualizacao',
      'orgaoJulgador',
      'grau',
      'nivelSigilo',
    ],
  };

  const { data } = await client.post(`/${INDEX}/_search`, body);

  return {
    total: data.hits?.total?.value ?? 0,
    hits: data.hits?.hits?.map((h: { _id: string; _source: Omit<Processo, 'id'> }) => ({
      id: h._id,
      ...h._source,
    })) ?? [],
  };
}

export async function getProcessoById(id: string): Promise<Processo> {
  const { data } = await client.get(`/${INDEX}/_doc/${id}`);
  return { id: data._id, ...data._source };
}
