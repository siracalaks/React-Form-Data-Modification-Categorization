import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class ExportService {
  static formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  static calculateStats(expenses) {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const average = total / expenses.length;
    
    // Calculate category totals
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Calculate monthly totals
    const monthlyTotals = expenses.reduce((acc, expense) => {
      const monthYear = new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
      return acc;
    }, {});

    return {
      total,
      average,
      categoryTotals,
      monthlyTotals
    };
  }

  static exportToExcel(expenses, isAllTime = false) {
    const stats = this.calculateStats(expenses);
    
    // Create main expense sheet
    const expenseSheet = XLSX.utils.json_to_sheet(
      expenses.map(expense => ({
        'Title': expense.title,
        'Amount': this.formatCurrency(expense.amount),
        'Date': this.formatDate(expense.date),
        'Category': expense.category
      }))
    );

    // Create summary sheet
    const summaryData = [
      ['Summary Statistics'],
      ['Total Expenses', this.formatCurrency(stats.total)],
      ['Average Expense', this.formatCurrency(stats.average)],
      ['Number of Expenses', expenses.length],
      [],
      ['Category Breakdown'],
      ...Object.entries(stats.categoryTotals).map(([category, amount]) => 
        [category, this.formatCurrency(amount)]
      ),
      [],
      ['Monthly Breakdown'],
      ...Object.entries(stats.monthlyTotals).map(([month, amount]) => 
        [month, this.formatCurrency(amount)]
      )
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Create workbook and add sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses');
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Auto-size columns
    const maxWidth = expenses.reduce((w, expense) => Math.max(w, expense.title.length), 10);
    const colWidths = [
      { wch: maxWidth }, // Title
      { wch: 12 }, // Amount
      { wch: 20 }, // Date
      { wch: 15 }  // Category
    ];
    expenseSheet['!cols'] = colWidths;

    const filename = isAllTime ? 'complete_expense_report.xlsx' : 'period_expense_report.xlsx';
    XLSX.writeFile(workbook, filename);
  }

  static exportToPDF(expenses, isAllTime = false) {
    const doc = new jsPDF();
    const stats = this.calculateStats(expenses);
    
    // Add header with logo (if you have one)
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185);
    doc.text('Expense Report', 14, 20);
    
    // Add report type and date
    doc.setFontSize(12);
    doc.setTextColor(127, 140, 141);
    doc.text(isAllTime ? 'Complete History Report' : 'Period Report', 14, 30);
    doc.text(`Generated on ${this.formatDate(new Date())}`, 14, 37);
    
    // Add summary statistics
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Summary Statistics', 14, 50);
    
    doc.setFontSize(11);
    doc.text(`Total Expenses: ${this.formatCurrency(stats.total)}`, 14, 60);
    doc.text(`Number of Expenses: ${expenses.length}`, 14, 67);
    doc.text(`Average Expense: ${this.formatCurrency(stats.average)}`, 14, 74);

    // Add expense table
    const tableColumn = ['Title', 'Amount', 'Date', 'Category'];
    const tableRows = expenses.map(expense => [
      expense.title,
      this.formatCurrency(expense.amount),
      this.formatDate(expense.date),
      expense.category
    ]);

    doc.autoTable({
      startY: 85,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
        halign: 'center',
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [189, 195, 199],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40, halign: 'right' },
        2: { cellWidth: 50, halign: 'center' },
        3: { cellWidth: 40, halign: 'center' }
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249]
      }
    });

    // Add category breakdown on new page
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Category Breakdown', 14, 20);

    const categoryData = Object.entries(stats.categoryTotals).map(([category, amount]) => [
      category,
      this.formatCurrency(amount)
    ]);

    doc.autoTable({
      startY: 30,
      head: [['Category', 'Total Amount']],
      body: categoryData,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
        halign: 'center'
      },
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      columnStyles: {
        1: { halign: 'right' }
      }
    });

    // Add monthly breakdown
    const monthlyData = Object.entries(stats.monthlyTotals).map(([month, amount]) => [
      month,
      this.formatCurrency(amount)
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Month', 'Total Amount']],
      body: monthlyData,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
        halign: 'center'
      },
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      columnStyles: {
        1: { halign: 'right' }
      }
    });

    // Add footer to all pages
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(127, 140, 141);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    const filename = isAllTime ? 'complete_expense_report.pdf' : 'period_expense_report.pdf';
    doc.save(filename);
  }
} 