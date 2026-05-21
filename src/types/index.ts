export interface Classe {
  codigo: number;
  nome: string;
}

export interface Assunto {
  codigo: number;
  nome: string;
}

export interface OrgaoJulgador {
  codigo: string;
  nome: string;
}

export interface Complemento {
  codigo: number;
  valor: number;
  nome: string;
  descricao: string;
}

export interface Movimento {
  codigo: number;
  nome: string;
  dataHora: string;
  orgaoJulgador?: OrgaoJulgador;
  complementosTabelados?: Complemento[];
}

export interface Processo {
  id: string;
  numeroProcesso: string;
  tribunal: string;
  grau: string;
  dataAjuizamento: string;
  dataHoraUltimaAtualizacao: string;
  classe: Classe;
  assuntos: Assunto[];
  orgaoJulgador: OrgaoJulgador;
  movimentos: Movimento[];
  nivelSigilo: number;
}

export interface SearchFilters {
  texto: string;
  campoPesquisa?: string;
  numeroProcesso?: string;
  instancia?: string;
  area?: string;
  orgaoMateria?: string;
  unidade?: string;
  unidadeId?: string;
  magistrado?: string;
  magistradoId?: string;
  tipoAto?: string;
  tipoAtoId?: string;
  dataInicio?: string;
  dataFim?: string;
  quantidade?: string;
}

export interface SearchResult {
  total: number;
  hits: Processo[];
}

// ── PROJUDI / jujuris-back ────────────────────────────────────────────────────

export interface JurisprudenciaResult {
  numeroProcesso: string;
  unidade: string;
  magistrado: string;
  tipoAto: string;
  dataPublicacao: string;
  textoDecisao: string;
  linkInteiroTeor?: string;
}

export interface JurisprudenciaBusca {
  total: number;
  tempoResposta: string;
  resultados: JurisprudenciaResult[];
  pagina: number;
}

export interface JurisprudenciaFilters {
  texto?: string;
  campoPesquisa?: string;
  instancia?: string;
  area?: string;
  orgaoMateria?: string;
  unidade?: string;
  unidadeId?: string;
  magistrado?: string;
  magistradoId?: string;
  tipoAto?: string;
  tipoAtoId?: string;
  numeroProcesso?: string;
  dataInicial?: string;
  dataFinal?: string;
  pagina?: number;
  quantidade?: number;
}
