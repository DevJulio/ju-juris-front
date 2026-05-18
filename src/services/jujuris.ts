import axios from 'axios';
import type { JurisprudenciaFilters, JurisprudenciaBusca, JurisprudenciaResult } from '../types';

const client = axios.create({
  baseURL: import.meta.env.DEV
    ? '/api'
    : (import.meta.env.VITE_JUJURIS_API_URL ?? 'http://localhost:3001'),
  headers: {
    'X-API-Key': import.meta.env.VITE_JUJURIS_API_KEY ?? '',
  },
});

// Cache simples para a página de detalhe acessar o resultado completo
export const resultsCache = new Map<string, JurisprudenciaResult>();

export async function buscarJurisprudencia(
  filtros: JurisprudenciaFilters,
): Promise<JurisprudenciaBusca> {
  const { data } = await client.post<JurisprudenciaBusca>('/buscar', filtros);
  data.resultados.forEach((r) => resultsCache.set(r.numeroProcesso, r));
  return data;
}
