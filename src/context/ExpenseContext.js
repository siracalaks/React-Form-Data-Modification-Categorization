import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredYear, setFilteredYear] = useState(new Date().getFullYear().toString());

  const addExpense = useCallback((expense, isTest = false) => {
    setExpenses(prevExpenses => [...prevExpenses, { ...expense, id: Math.random().toString(), isTest }]);
  }, []);

  const clearTestData = useCallback(() => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => !expense.isTest));
  }, []);

  const getFilteredExpenses = useCallback(() => {
    return expenses.filter(expense => {
      const expenseYear = new Date(expense.date).getFullYear().toString();
      return expenseYear === filteredYear;
    });
  }, [expenses, filteredYear]);

  const getAllExpenses = useCallback(() => {
    return expenses;
  }, [expenses]);

  const getExpenseStats = useCallback(() => {
    const filteredExpenses = getFilteredExpenses();
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      total,
      count: filteredExpenses.length,
      average: filteredExpenses.length > 0 ? total / filteredExpenses.length : 0
    };
  }, [getFilteredExpenses]);

  const value = {
    expenses,
    filteredYear,
    setFilteredYear,
    addExpense,
    clearTestData,
    getFilteredExpenses,
    getAllExpenses,
    getExpenseStats
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

ExpenseProvider.propTypes = {
  children: PropTypes.node.isRequired
}; 