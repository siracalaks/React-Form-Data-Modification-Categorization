import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : {
      total: 0,
      categories: {},
    };
  });

  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const setBudget = (category, amount) => {
    setBudgets(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: amount,
      },
      total: Object.values({ ...prev.categories, [category]: amount }).reduce((a, b) => a + b, 0),
    }));
    toast.success(`${category} için bütçe güncellendi!`);
  };

  const addGoal = (goal) => {
    setGoals(prev => [...prev, {
      ...goal,
      id: Math.random().toString(),
      createdAt: new Date().toISOString(),
      progress: 0,
    }]);
    toast.success('Yeni hedef eklendi!');
  };

  const updateGoalProgress = (goalId, progress) => {
    setGoals(prev => prev.map(goal =>
      goal.id === goalId
        ? { ...goal, progress: Math.min(100, progress) }
        : goal
    ));
    toast.info('Hedef ilerleme durumu güncellendi');
  };

  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast.info('Hedef silindi');
  };

  const getBudgetStatus = (category) => {
    const budget = budgets.categories[category] || 0;
    const spent = 0; // Bu değer ExpenseContext'ten alınacak
    return {
      budget,
      spent,
      remaining: budget - spent,
      percentage: budget ? (spent / budget) * 100 : 0,
    };
  };

  const getGoalStatus = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return null;

    const daysLeft = Math.ceil(
      (new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return {
      ...goal,
      daysLeft,
      isOverdue: daysLeft < 0,
      isCompleted: goal.progress >= 100,
    };
  };

  return (
    <BudgetContext.Provider value={{
      budgets,
      goals,
      setBudget,
      addGoal,
      updateGoalProgress,
      deleteGoal,
      getBudgetStatus,
      getGoalStatus,
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}; 