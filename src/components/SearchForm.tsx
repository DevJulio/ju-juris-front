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

const GRAUS = [
  { value: '', label: 'Todos' },
  { value: 'G1', label: '1º Grau' },
  { value: 'G2', label: '2º Grau' },
  { value: 'JE', label: 'Juizado Especial' },
  { value: 'SUP', label: 'Superior' },
];

const initialFilters: SearchFilters = {
  texto: '',
  numeroProcesso: '',
  grau: '',
  classeNome: '',
  orgaoJulgador: '',
  dataInicio: '',
  dataFim: '',
};

export default function SearchForm({ onSearch, loading, initialValues }: Props) {
  const [filters, setFilters] = useState<SearchFilters>(initialValues ?? initialFilters);

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSelectChange(e: SelectChangeEvent) {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
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
            label="Buscar por assunto"
            placeholder='Ex: "dano moral", responsabilidade civil...'
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

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="numeroProcesso"
            label="Número do processo"
            placeholder="Ex: 5000001-00.2024.8.09.0000"
            value={filters.numeroProcesso ?? ''}
            onChange={handleTextChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="orgaoJulgador"
            label="Órgão julgador"
            placeholder="Ex: 1ª Câmara Cível"
            value={filters.orgaoJulgador ?? ''}
            onChange={handleTextChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="grau-label">Grau</InputLabel>
            <Select
              labelId="grau-label"
              name="grau"
              label="Grau"
              value={filters.grau ?? ''}
              onChange={handleSelectChange}
            >
              {GRAUS.map(g => (
                <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            name="classeNome"
            label="Classe processual"
            placeholder="Ex: Apelação"
            value={filters.classeNome ?? ''}
            onChange={handleTextChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            name="dataInicio"
            label="Data início"
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
            label="Data fim"
            type="date"
            value={filters.dataFim ?? ''}
            onChange={handleTextChange}
            slotProps={{ inputLabel: { shrink: true } }}
          />
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
