import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  Paper
} from '@mui/material';
import './ExpenseForm.css';

const CATEGORIES = [
  { value: 'Gıda', label: '🍽️ Gıda' },
  { value: 'Ulaşım', label: '🚗 Ulaşım' },
  { value: 'Eğlence', label: '🎮 Eğlence' },
  { value: 'Faturalar', label: '📄 Faturalar' },
  { value: 'Alışveriş', label: '🛍️ Alışveriş' },
  { value: 'Sağlık', label: '🏥 Sağlık' },
  { value: 'Eğitim', label: '📚 Eğitim' },
  { value: 'Diğer', label: '📌 Diğer' }
];

const ExpenseForm = (props) => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  const [enteredDate, setEnteredDate] = useState('');
  const [enteredCategory, setEnteredCategory] = useState('');

  useEffect(() => {
    if (props.editingExpense) {
      setEnteredTitle(props.editingExpense.title);
      setEnteredAmount(props.editingExpense.amount.toString());
      setEnteredDate(props.editingExpense.date.toISOString().split('T')[0]);
      setEnteredCategory(props.editingExpense.category);
    }
  }, [props.editingExpense]);

  const submitHandler = (event) => {
    event.preventDefault();

    const expenseData = {
      title: enteredTitle,
      amount: +enteredAmount,
      date: new Date(enteredDate),
      category: enteredCategory
    };

    props.onSaveExpenseData(expenseData);
    setEnteredTitle('');
    setEnteredAmount('');
    setEnteredDate('');
    setEnteredCategory('');
  };

  return (
    <Paper elevation={3} className="expense-form-paper">
      <form onSubmit={submitHandler}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Başlık"
              value={enteredTitle}
              onChange={(e) => setEnteredTitle(e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tutar"
              type="number"
              value={enteredAmount}
              onChange={(e) => setEnteredAmount(e.target.value)}
              required
              variant="outlined"
              InputProps={{
                startAdornment: '₺',
                inputProps: { min: "0.01", step: "0.01" }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tarih"
              type="date"
              value={enteredDate}
              onChange={(e) => setEnteredDate(e.target.value)}
              required
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: "2021-01-01",
                max: "2024-12-31"
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={enteredCategory}
                onChange={(e) => setEnteredCategory(e.target.value)}
                label="Kategori"
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <div className="form-actions">
              <Button
                variant="outlined"
                color="secondary"
                onClick={props.onCancel}
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {props.editingExpense ? 'Güncelle' : 'Ekle'}
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

ExpenseForm.propTypes = {
  onSaveExpenseData: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editingExpense: PropTypes.shape({
    title: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    category: PropTypes.string.isRequired
  })
};

export default ExpenseForm;