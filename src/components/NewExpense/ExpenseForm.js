import React, { useState } from 'react';
import './ExpenseForm.css';

const ExpenseForm = (props) => {
    // 3 state tek state ile tanımlayıp fonksiyonları da ona göre entegre etmek istiyorsan. State 3=1 txt  dosyasına bak...
    const [enteredTitle, setEnteredTitle] = useState('');
    const [enteredAmount, setEnteredAmount] = useState('');
    const [enteredDate, setEnteredDate] = useState('');

    const titleChangeHandler = (event) => {
        setEnteredTitle(event.target.value);
    };
    const amountChangeHandler = (event) => {
        setEnteredAmount(event.target.value);
    };
    const dateChangeHandler = (event) => {
        setEnteredDate(event.target.value);
    };

    const submitHandler = (event) => {
        // Bir form gönderme düğmesine tıklama olayı gerçekleştiğinde, sayfanın yeniden yüklenmesi ve form verilerinin 
        // sunucuya gönderilmesi gibi varsayılan davranışları vardır. Ancak, bazen bu davranışları engellemek isteyebilirsiniz.
        event.preventDefault();

        const expenseData = {
            title: enteredTitle,
            amount: +enteredAmount,
            date: new Date(enteredDate)
        };
        //expenseData objesini konsolda bastırır
        // console.log(expenseData)
        props.onSaveExpenseData(expenseData);
        //Boş dizeye döndürür , inputları...
        setEnteredTitle('');
        setEnteredAmount('');
        setEnteredDate('');
    };
  return (
    <form onSubmit={submitHandler}> 
        <div className='new-expense__controls'>
            <div className='new-expense__control'>
                <label>Title</label>
                <input type="text" value={enteredTitle} onChange={titleChangeHandler} />
            </div>
            <div className='new-expense__control'>
                <label>Amount</label>
                <input type="number" value={enteredAmount}  min="0.01" step="0.01" onChange={amountChangeHandler} />
            </div>
            <div className='new-expense__control'>
                <label>Date</label>
                <input type="date" value={enteredDate}  min="15-03-2023" max="15-03-2024" onChange={dateChangeHandler} />
            </div>
            <div className='new-expense__actions'>
                <button type='button' onClick={props.onCancel}>Cancel</button>
                <button type='submit' >Add Expense</button>
            </div>
        </div>
    </form>
  );
};

export default ExpenseForm;