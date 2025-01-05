import React, { useState } from 'react'
import { Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { Add as AddIcon, Science as ScienceIcon, Delete as DeleteIcon } from '@mui/icons-material'
import ExpenseForm from './ExpenseForm'
import { useExpenses } from '../../context/ExpenseContext'
import './NewExpense.css'

// Test data template
const createTestData = (year) => [
  {
    title: 'Test Grocery Shopping',
    amount: 25.50,
    date: new Date(year, 0, 15),
    category: 'Food'
  },
  {
    title: 'Test Gas',
    amount: 45.00,
    date: new Date(year, 0, 16),
    category: 'Transportation'
  },
  {
    title: 'Test Movie',
    amount: 15.00,
    date: new Date(year, 0, 17),
    category: 'Entertainment'
  }
]

// Generate last 5 years
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, index) => currentYear - index)
}

const YEARS = generateYearOptions()

const NewExpense = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const { addExpense, clearTestData } = useExpenses()

  const saveExpenseDataHandler = (enteredExpenseData) => {
    addExpense({
      ...enteredExpenseData,
      category: enteredExpenseData.category || 'Other'
    })
    setIsEditing(false)
  }

  const handleTestDataAdd = () => {
    const testData = createTestData(selectedYear)
    testData.forEach(expense => {
      addExpense(expense, true)
    })
    setIsTestDialogOpen(false)
  }

  return (
    <div className='new-expense'>
      {!isEditing ? (
        <Stack direction='row' spacing={2}>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => setIsEditing(true)}
          >
            Add New Expense
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            startIcon={<ScienceIcon />}
            onClick={() => setIsTestDialogOpen(true)}
          >
            Add Test Data
          </Button>
          <Button
            variant='outlined'
            color='error'
            startIcon={<DeleteIcon />}
            onClick={clearTestData}
          >
            Clear Test Data
          </Button>
        </Stack>
      ) : (
        <ExpenseForm
          onSaveExpenseData={saveExpenseDataHandler}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {/* Test Data Year Selection Dialog */}
      <Dialog open={isTestDialogOpen} onClose={() => setIsTestDialogOpen(false)}>
        <DialogTitle>Select Test Data Year</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Year"
            >
              {YEARS.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsTestDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleTestDataAdd} variant="contained" color="primary">
            Add Test Data
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default NewExpense