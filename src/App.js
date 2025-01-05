import React from 'react';
import { Container } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import NewExpense from './components/NewExpense/NewExpense';
import Expenses from './components/Expenses/Expenses';
import ExpenseStats from './components/Expenses/ExpenseStats';
import { ThemeProvider } from './context/ThemeContext';
import { ExpenseProvider } from './context/ExpenseContext';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <Container>
          <NewExpense />
          <ExpenseStats />
          <Expenses />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Container>
      </ExpenseProvider>
    </ThemeProvider>
  );
};

export default App;