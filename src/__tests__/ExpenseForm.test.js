import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../context/ThemeContext';
import { ExpenseProvider } from '../context/ExpenseContext';
import ExpenseForm from '../components/NewExpense/ExpenseForm';

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      <ExpenseProvider>
        {component}
      </ExpenseProvider>
    </ThemeProvider>
  );
};

describe('ExpenseForm Component', () => {
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    renderWithProviders(<ExpenseForm onCancel={mockOnCancel} />);
  });

  test('renders form fields correctly', () => {
    expect(screen.getByLabelText(/başlık/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tutar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tarih/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kategori/i)).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    const submitButton = screen.getByRole('button', { name: /ekle/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/başlık zorunludur/i)).toBeInTheDocument();
      expect(screen.getByText(/tutar zorunludur/i)).toBeInTheDocument();
      expect(screen.getByText(/kategori zorunludur/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const titleInput = screen.getByLabelText(/başlık/i);
    const amountInput = screen.getByLabelText(/tutar/i);
    const dateInput = screen.getByLabelText(/tarih/i);
    const categorySelect = screen.getByLabelText(/kategori/i);

    userEvent.type(titleInput, 'Test Harcama');
    userEvent.type(amountInput, '100');
    userEvent.type(dateInput, '2023-12-31');
    userEvent.selectOptions(categorySelect, 'Gıda');

    const submitButton = screen.getByRole('button', { name: /ekle/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/başlık zorunludur/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/tutar zorunludur/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/kategori zorunludur/i)).not.toBeInTheDocument();
    });
  });

  test('cancels form submission', () => {
    const cancelButton = screen.getByRole('button', { name: /iptal/i });
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('validates amount field for positive numbers', async () => {
    const amountInput = screen.getByLabelText(/tutar/i);
    userEvent.type(amountInput, '-100');

    const submitButton = screen.getByRole('button', { name: /ekle/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/tutar pozitif olmalıdır/i)).toBeInTheDocument();
    });
  });

  test('validates future dates', async () => {
    const dateInput = screen.getByLabelText(/tarih/i);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    
    userEvent.type(dateInput, futureDate.toISOString().split('T')[0]);

    const submitButton = screen.getByRole('button', { name: /ekle/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/gelecek tarihli harcama girilemez/i)).toBeInTheDocument();
    });
  });
}); 