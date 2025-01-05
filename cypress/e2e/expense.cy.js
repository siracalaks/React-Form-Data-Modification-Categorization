/// <reference types="cypress" />

describe('Expense Management', () => {
  beforeEach(() => {
    cy.visit('/');
    // Local storage'ı temizle
    cy.clearLocalStorage();
  });

  it('should add a new expense', () => {
    // Form alanlarını doldur
    cy.get('input[name="title"]').type('Test Harcama');
    cy.get('input[name="amount"]').type('100');
    cy.get('input[name="date"]').type('2023-12-31');
    cy.get('select[name="category"]').select('Gıda');

    // Formu gönder
    cy.contains('button', 'Ekle').click();

    // Harcamanın eklendiğini kontrol et
    cy.contains('Test Harcama').should('exist');
    cy.contains('₺100').should('exist');
    cy.contains('Gıda').should('exist');
  });

  it('should show validation errors', () => {
    // Boş formu gönder
    cy.contains('button', 'Ekle').click();

    // Hata mesajlarını kontrol et
    cy.contains('Başlık zorunludur').should('exist');
    cy.contains('Tutar zorunludur').should('exist');
    cy.contains('Kategori zorunludur').should('exist');
  });

  it('should filter expenses by year', () => {
    // Önce bir harcama ekle
    cy.get('input[name="title"]').type('Test Harcama 2023');
    cy.get('input[name="amount"]').type('100');
    cy.get('input[name="date"]').type('2023-12-31');
    cy.get('select[name="category"]').select('Gıda');
    cy.contains('button', 'Ekle').click();

    // Başka bir yıl için harcama ekle
    cy.get('input[name="title"]').type('Test Harcama 2022');
    cy.get('input[name="amount"]').type('200');
    cy.get('input[name="date"]').type('2022-12-31');
    cy.get('select[name="category"]').select('Gıda');
    cy.contains('button', 'Ekle').click();

    // 2023 yılını seç
    cy.get('select[data-testid="year-filter"]').select('2023');

    // Sadece 2023 harcamasının görünür olduğunu kontrol et
    cy.contains('Test Harcama 2023').should('exist');
    cy.contains('Test Harcama 2022').should('not.exist');
  });

  it('should toggle dark mode', () => {
    // Tema değiştirme butonuna tıkla
    cy.get('button[aria-label="toggle theme"]').click();

    // Dark mode'un aktif olduğunu kontrol et
    cy.get('body').should('have.css', 'background-color', 'rgb(18, 18, 18)');

    // Tekrar light mode'a geç
    cy.get('button[aria-label="toggle theme"]').click();
    cy.get('body').should('have.css', 'background-color', 'rgb(245, 245, 245)');
  });

  it('should show expense statistics', () => {
    // Birkaç harcama ekle
    const expenses = [
      { title: 'Harcama 1', amount: '100', date: '2023-12-01', category: 'Gıda' },
      { title: 'Harcama 2', amount: '200', date: '2023-12-02', category: 'Ulaşım' },
      { title: 'Harcama 3', amount: '300', date: '2023-12-03', category: 'Gıda' },
    ];

    expenses.forEach(expense => {
      cy.get('input[name="title"]').type(expense.title);
      cy.get('input[name="amount"]').type(expense.amount);
      cy.get('input[name="date"]').type(expense.date);
      cy.get('select[name="category"]').select(expense.category);
      cy.contains('button', 'Ekle').click();
    });

    // İstatistikleri kontrol et
    cy.contains('Toplam Harcama').parent().contains('₺600');
    cy.contains('Harcama Sayısı').parent().contains('3');
    cy.contains('Ortalama Harcama').parent().contains('₺200');
  });

  it('should export expenses', () => {
    // Bir harcama ekle
    cy.get('input[name="title"]').type('Export Test');
    cy.get('input[name="amount"]').type('100');
    cy.get('input[name="date"]').type('2023-12-31');
    cy.get('select[name="category"]').select('Gıda');
    cy.contains('button', 'Ekle').click();

    // Excel'e aktar butonuna tıkla
    cy.contains('button', 'Excel\'e Aktar').click();

    // İndirilen dosyayı kontrol et
    cy.readFile('downloads/harcamalar.xlsx').should('exist');
  });

  it('should handle offline mode', () => {
    // Offline moda geç
    cy.window().then((win) => {
      win.navigator.serviceWorker.ready.then(() => {
        cy.log('Service Worker is ready');
      });
    });

    cy.intercept('*', (req) => {
      req.destroy();
    });

    // Offline modda harcama ekle
    cy.get('input[name="title"]').type('Offline Harcama');
    cy.get('input[name="amount"]').type('100');
    cy.get('input[name="date"]').type('2023-12-31');
    cy.get('select[name="category"]').select('Gıda');
    cy.contains('button', 'Ekle').click();

    // Harcamanın eklendiğini kontrol et
    cy.contains('Offline Harcama').should('exist');

    // Online moda geri dön
    cy.intercept('*').as('online');
  });
}); 