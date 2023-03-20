import React, { useState } from 'react';

import Expenses from './components/Expenses/Expenses';
import NewExpense from './components/NewExpense/NewExpense';

const DUMMY_EXPENSES = [
  {
    id: 'e1',
    title: 'Domates',
    amount: 8.99,
    date: new Date(2020, 7, 14),
  },
  { id: 'e2', 
  title: 'Salatalık', 
  amount: 9.99, 
  date: new Date(2021, 2, 12) },
  {
    id: 'e3',
    title: 'Dere Otu',
    amount: 4.50,
    date: new Date(2021, 2, 28),
  },
  {
    id: 'e4',
    title: 'Patlıcan',
    amount: 18,
    date: new Date(2021, 5, 12),
  },
];

const App = () => {
  const [expenses, setExpenses] = useState(DUMMY_EXPENSES);

  const addExpenseHandler = (expense) => {
    setExpenses((prevExpenses) => {
      return[expense, ...prevExpenses];
    });
  };
  return (
    <div>
      <NewExpense onAddExpense={addExpenseHandler} />
      <Expenses items={expenses} />
    </div>
  );
}

export default App;