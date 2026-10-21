/**
 * Skenario Pengujian End-to-End (E2E):
 *
 * - Login Spec
 *  - harus menampilkan halaman login dengan elemen form yang lengkap (email, password, tombol submit)
 *  - harus menampilkan pesan error ketika login gagal (kredensial salah)
 *  - harus berhasil login dan dialihkan ke halaman utama serta menampilkan tombol logout ketika kredensial benar
 */

describe('Login Spec', () => {
  beforeEach(() => {
    // Kunjungi halaman login sebelum setiap pengujian
    cy.visit('/login');
  });

  it('harus menampilkan halaman login dengan elemen form yang lengkap', () => {
    // Memverifikasi elemen-elemen penting pada halaman login
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Login');
    cy.contains('Masuk ke Forum Diskusi').should('be.visible');
  });

  it('harus menampilkan pesan error ketika kredensial tidak valid', () => {
    // Intercept endpoint login untuk mensimulasikan kegagalan autentikasi
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: {
        status: 'fail',
        message: 'email or password is wrong',
      },
    }).as('loginFail');

    // Mengisi form dengan data yang salah
    cy.get('input[type="email"]').type('wronguser@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Memverifikasi request login tertangkap dan pesan error ditampilkan
    cy.wait('@loginFail');
    cy.contains('email or password is wrong').should('be.visible');
  });

  it('harus berhasil login dan dialihkan ke homepage dengan profil pengguna', () => {
    // Mock user profile data
    const mockUser = {
      id: 'user-john-doe',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe',
    };

    // Intercept endpoint login sukses
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          token: 'mock-jwt-token-cypress',
        },
      },
    }).as('loginSuccess');

    // Intercept endpoint profile pengguna
    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          user: mockUser,
        },
      },
    }).as('getProfile');

    // Intercept threads untuk halaman utama
    cy.intercept('GET', '**/threads', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          threads: [],
        },
      },
    }).as('getThreads');

    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          users: [mockUser],
        },
      },
    }).as('getUsers');

    // Mengisi kredensial valid
    cy.get('input[type="email"]').type('john@example.com');
    cy.get('input[type="password"]').type('secretpassword123');
    cy.get('button[type="submit"]').click();

    // Menunggu respon API
    cy.wait('@loginSuccess');
    cy.wait('@getProfile');

    // Memverifikasi pengalihan ke halaman utama dan nama user serta tombol logout muncul
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.contains('John Doe').should('be.visible');
    cy.contains('Logout').should('be.visible');
  });
});
