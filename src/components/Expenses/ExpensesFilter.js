import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import './ExpensesFilter.css';

// Dinamik olarak son 5 yılı oluştur
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, index) => (currentYear - index).toString());
};

const YEARS = generateYearOptions();

const ExpensesFilter = ({ selected, onChangeFilter }) => {
  // Eğer seçili yıl mevcut seçenekler arasında yoksa, varsayılan olarak güncel yılı seç
  const validYear = YEARS.includes(selected) ? selected : YEARS[0];

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <FormControl fullWidth variant="outlined">
        <InputLabel>Yıla Göre Filtrele</InputLabel>
        <Select
          value={validYear}
          onChange={(e) => onChangeFilter(e.target.value)}
          label="Yıla Göre Filtrele"
        >
          {YEARS.map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

ExpensesFilter.propTypes = {
  onChangeFilter: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired
};

export default ExpensesFilter;