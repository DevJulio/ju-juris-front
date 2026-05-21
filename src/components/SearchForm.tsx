import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  InputLabel,
  FormControl,
  InputAdornment,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { SearchFilters } from '../types';

interface Props {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
  initialValues?: SearchFilters;
}

const INSTANCIAS = [
  { value: '', label: 'Todas as instâncias' },
  { value: '1o Grau', label: '1º Grau' },
  { value: 'Turma de Uniformização / Turmas Recursais', label: 'Turma de Uniformização / Turmas Recursais' },
  { value: 'Tribunal', label: 'Tribunal' },
];

const CAMPOS_PESQUISA = [
  { value: '', label: 'Todos' },
  { value: 'recursoProcCnj', label: 'Recurso / Proc. CNJ' },
  { value: 'descricaoRecurso', label: 'Descrição do recurso' },
  { value: 'decisao', label: 'Decisão' },
  { value: 'ementa', label: 'Ementa' },
  { value: 'relator', label: 'Relator' },
  { value: 'comarca', label: 'Comarca' },
  { value: 'dataAcordao', label: 'Data do acórdão' },
];

const AREAS = [
  { value: '', label: 'Todas as áreas' },
  { value: 'Cível', label: 'Cível' },
  { value: 'Criminal', label: 'Criminal' },
];

const QUANTIDADES = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
];

const TIPOS_ATO = [
  { id: '', label: 'Todos os tipos' },
  { id: '22', label: 'Acórdão' },
  { id: '15', label: 'Decisão' },
  { id: '149', label: 'Decisão Monocrática' },
  { id: '124', label: 'Ementa' },
  { id: '123', label: 'Relatório' },
  { id: '125', label: 'Relatório e Voto' },
  { id: '14', label: 'Sentença' },
];

const ORGAOS_MATERIA = [
  { value: 'Turma Recursal Cível e Criminal', label: 'Turma Recursal Cível e Criminal', instancia: 'Turma de Uniformização / Turmas Recursais' },
  { value: 'UPJ Turma Recursal', label: 'UPJ Turma Recursal', instancia: 'Turma de Uniformização / Turmas Recursais' },
  { value: 'Câmaras Cíveis', label: 'Câmaras Cíveis', instancia: 'Tribunal', area: 'Cível' },
  { value: 'Câmaras Criminais', label: 'Câmaras Criminais', instancia: 'Tribunal', area: 'Criminal' },
  { value: 'Seções Cíveis', label: 'Seções Cíveis', instancia: 'Tribunal', area: 'Cível' },
  { value: 'Seção Criminal', label: 'Seção Criminal', instancia: 'Tribunal', area: 'Criminal' },
  { value: 'Órgão Especial', label: 'Órgão Especial', instancia: 'Tribunal' },
  { value: 'Conselho Superior de Magistratura', label: 'Conselho Superior de Magistratura', instancia: 'Tribunal', area: 'Cível' },
  { value: 'Plantão 2º Grau - Órgão Especial', label: 'Plantão 2º Grau - Órgão Especial', instancia: 'Tribunal' },
  { value: 'Plantão 2º Grau - Câmaras Cíveis', label: 'Plantão 2º Grau - Câmaras Cíveis', instancia: 'Tribunal', area: 'Cível' },
  { value: 'Plantão 2º Grau - Câmaras Criminais', label: 'Plantão 2º Grau - Câmaras Criminais', instancia: 'Tribunal', area: 'Criminal' },
  { value: 'Juizado Especial Cível', label: 'Juizado Especial Cível', instancia: '1o Grau', area: 'Cível' },
  { value: 'Juizado Especial Criminal', label: 'Juizado Especial Criminal', instancia: '1o Grau', area: 'Criminal' },
  { value: 'Juizado Especial Cível e Criminal', label: 'Juizado Especial Cível e Criminal', instancia: '1o Grau' },
  { value: 'Juizado Especial Fazenda Pública', label: 'Juizado Especial Fazenda Pública', instancia: '1o Grau', area: 'Cível' },
  { value: 'Juizado de Violência Doméstica', label: 'Juizado de Violência Doméstica', instancia: '1o Grau', area: 'Criminal' },
  { value: 'Varas Cíveis', label: 'Varas Cíveis', instancia: '1o Grau', area: 'Cível' },
  { value: 'Varas Criminais', label: 'Varas Criminais', instancia: '1o Grau', area: 'Criminal' },
  { value: 'Família', label: 'Família', instancia: '1o Grau', area: 'Cível' },
  { value: 'Infância e Juventude Cível', label: 'Infância e Juventude Cível', instancia: '1o Grau', area: 'Cível' },
  { value: 'Infância e Juventude Infracional', label: 'Infância e Juventude Infracional', instancia: '1o Grau', area: 'Criminal' },
  { value: 'Execução Penal', label: 'Execução Penal', instancia: '1o Grau', area: 'Criminal' },
  { value: 'Execução de Pena Alternativa', label: 'Execução de Pena Alternativa', instancia: '1o Grau', area: 'Criminal' },
  { value: 'Auditoria Militar Cível', label: 'Auditoria Militar Cível', instancia: '1o Grau', area: 'Cível' },
  { value: 'Auditoria Militar Criminal', label: 'Auditoria Militar Criminal', instancia: '1o Grau', area: 'Criminal' },
  { value: 'Fazenda Pública Estadual', label: 'Fazenda Pública Estadual', instancia: '1o Grau', area: 'Cível' },
  { value: 'Fazenda Pública Estadual - Execução Fiscal', label: 'Fazenda Pública Estadual - Execução Fiscal', instancia: '1o Grau', area: 'Cível' },
  { value: 'Fazenda Pública Estadual Interior', label: 'Fazenda Pública Estadual Interior', instancia: '1o Grau', area: 'Cível' },
  { value: 'Fazenda Pública Municipal', label: 'Fazenda Pública Municipal', instancia: '1o Grau', area: 'Cível' },
  { value: 'Fazenda Pública Municipal - Execução Fiscal', label: 'Fazenda Pública Municipal - Execução Fiscal', instancia: '1o Grau', area: 'Cível' },
  { value: 'Fazenda Pública Municipal Interior', label: 'Fazenda Pública Municipal Interior', instancia: '1o Grau', area: 'Cível' },
  { value: 'Fazenda Pública Mista', label: 'Fazenda Pública Mista', instancia: '1o Grau', area: 'Cível' },
  { value: 'Fazenda Pública Mista - Execução Fiscal', label: 'Fazenda Pública Mista - Execução Fiscal', instancia: '1o Grau', area: 'Cível' },
  { value: 'Plantão 1º Grau', label: 'Plantão 1º Grau', instancia: '1o Grau' },
  { value: 'UPJ Cível', label: 'UPJ Cível', instancia: '1o Grau', area: 'Cível' },
  { value: 'UPJ Criminal', label: 'UPJ Criminal', instancia: '1o Grau', area: 'Criminal' },
  { value: 'UPJ Sucessões', label: 'UPJ Sucessões', instancia: '1o Grau', area: 'Cível' },
  { value: 'UPJ Família', label: 'UPJ Família', instancia: '1o Grau', area: 'Cível' },
  { value: 'UPJ de Violência Doméstica', label: 'UPJ de Violência Doméstica', instancia: '1o Grau', area: 'Criminal' },
  { value: 'UPJ Família Interior', label: 'UPJ Família Interior', instancia: '1o Grau', area: 'Cível' },
  { value: 'UPJ Fazenda Pública Estadual', label: 'UPJ Fazenda Pública Estadual', instancia: '1o Grau', area: 'Cível' },
  { value: 'UPJ Fazenda Pública Municipal', label: 'UPJ Fazenda Pública Municipal', instancia: '1o Grau', area: 'Cível' },
  { value: 'UPJ dos Juizados Especiais Cíveis', label: 'UPJ dos Juizados Especiais Cíveis', instancia: '1o Grau', area: 'Cível' },
  { value: 'UPJ Juizado Especial da Fazenda Pública', label: 'UPJ Juizado Especial da Fazenda Pública', instancia: '1o Grau', area: 'Cível' },
];

const initialFilters: SearchFilters = {
  texto: '',
  campoPesquisa: '',
  numeroProcesso: '',
  instancia: '',
  area: '',
  orgaoMateria: '',
  unidade: '',
  magistrado: '',
  tipoAto: '',
  tipoAtoId: '',
  dataInicio: '',
  dataFim: '',
  quantidade: '10',
};

export default function SearchForm({ onSearch, loading, initialValues }: Props) {
  const [filters, setFilters] = useState<SearchFilters>({ ...initialFilters, ...initialValues });

  const orgaosMateria = ORGAOS_MATERIA.filter((orgao) => {
    const instanciaOk = !filters.instancia || orgao.instancia === filters.instancia;
    const areaOk = !filters.area || !orgao.area || orgao.area === filters.area;
    return instanciaOk && areaOk;
  });

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSelectChange(e: SelectChangeEvent) {
    setFilters(f => {
      if (e.target.name === 'tipoAtoId') {
        const tipoAto = TIPOS_ATO.find(tipo => tipo.id === e.target.value);
        return {
          ...f,
          tipoAto: tipoAto?.id ? tipoAto.label : '',
          tipoAtoId: tipoAto?.id ?? '',
        };
      }

      const next = { ...f, [e.target.name]: e.target.value };
      if (e.target.name === 'campoPesquisa') {
        if (e.target.value === 'ementa') {
          next.tipoAto = 'Ementa';
          next.tipoAtoId = '124';
        }
        if (e.target.value === 'decisao') {
          next.tipoAto = 'Decisão';
          next.tipoAtoId = '15';
        }
      }
      if (e.target.name === 'instancia' || e.target.name === 'area') {
        next.orgaoMateria = '';
      }
      if (e.target.name === 'instancia' && e.target.value === 'Turma de Uniformização / Turmas Recursais') {
        next.area = '';
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(filters);
  }

  function handleClear() {
    setFilters(initialFilters);
    onSearch(initialFilters);
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            fullWidth
            name="texto"
            label="Digite um termo para a pesquisa"
            placeholder='Use aspas para busca exata. Ex: "indenização por erro médico"'
            value={filters.texto}
            onChange={handleTextChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="campo-pesquisa-label">Campo de pesquisa</InputLabel>
            <Select
              labelId="campo-pesquisa-label"
              name="campoPesquisa"
              label="Campo de pesquisa"
              value={filters.campoPesquisa ?? ''}
              onChange={handleSelectChange}
            >
              {CAMPOS_PESQUISA.map(campo => (
                <MenuItem key={campo.value || 'todos'} value={campo.value}>{campo.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="instancia-label">Instância</InputLabel>
            <Select
              labelId="instancia-label"
              name="instancia"
              label="Instância"
              value={filters.instancia ?? ''}
              onChange={handleSelectChange}
            >
              {INSTANCIAS.map(instancia => (
                <MenuItem key={instancia.value} value={instancia.value}>{instancia.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="area-label">Área</InputLabel>
            <Select
              labelId="area-label"
              name="area"
              label="Área"
              value={filters.area ?? ''}
              onChange={handleSelectChange}
              disabled={filters.instancia === 'Turma de Uniformização / Turmas Recursais'}
            >
              {AREAS.map(area => (
                <MenuItem key={area.value} value={area.value}>{area.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="orgao-materia-label">Órgão / Matéria</InputLabel>
            <Select
              labelId="orgao-materia-label"
              name="orgaoMateria"
              label="Órgão / Matéria"
              value={filters.orgaoMateria ?? ''}
              onChange={handleSelectChange}
            >
              <MenuItem value="">Todas as opções</MenuItem>
              {orgaosMateria.map(orgao => (
                <MenuItem key={`${orgao.instancia}-${orgao.area ?? 'todas'}-${orgao.value}`} value={orgao.value}>
                  {orgao.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            name="unidade"
            label="Unidade específica"
            placeholder="Digite a unidade específica"
            value={filters.unidade ?? ''}
            onChange={handleTextChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            name="magistrado"
            label="Magistrada ou magistrado"
            placeholder="Digite o nome do magistrado(a)"
            value={filters.magistrado ?? ''}
            onChange={handleTextChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="tipo-ato-label">Tipo de ato</InputLabel>
            <Select
              labelId="tipo-ato-label"
              name="tipoAtoId"
              label="Tipo de ato"
              value={filters.tipoAtoId ?? ''}
              onChange={handleSelectChange}
            >
              {TIPOS_ATO.map(tipo => (
                <MenuItem key={tipo.id || 'todos'} value={tipo.id}>{tipo.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            name="numeroProcesso"
            label="Número do processo"
            placeholder="Ex: 5000280-28.2010.8.09.0059"
            value={filters.numeroProcesso ?? ''}
            onChange={handleTextChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            name="dataInicio"
            label="Data inicial"
            type="date"
            value={filters.dataInicio ?? ''}
            onChange={handleTextChange}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            name="dataFim"
            label="Data final"
            type="date"
            value={filters.dataFim ?? ''}
            onChange={handleTextChange}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="quantidade-label">Qtd. por página</InputLabel>
            <Select
              labelId="quantidade-label"
              name="quantidade"
              label="Qtd. por página"
              value={filters.quantidade ?? '10'}
              onChange={handleSelectChange}
            >
              {QUANTIDADES.map(qtd => (
                <MenuItem key={qtd.value} value={qtd.value}>{qtd.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              disabled={loading}
              sx={{
                minWidth: 160,
                textTransform: 'uppercase',
                letterSpacing: 1,
                bgcolor: '#1a3a5c',
                '&:hover': { bgcolor: '#0f2235' },
              }}
            >
              {loading ? 'Buscando...' : 'Consultar'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClear}
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 1,
                borderColor: '#1a3a5c',
                color: '#1a3a5c',
                '&:hover': { bgcolor: '#f0f4ff', borderColor: '#1a3a5c' },
              }}
            >
              Limpar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
