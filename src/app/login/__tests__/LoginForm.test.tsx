import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import LoginForm from '../page';
import { api } from '@/services/api';

// Mock API
jest.mock('@/services/api', () => ({
  api: {
    auth: {
      login: jest.fn(),
      getProfile: jest.fn(),
    },
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    expect(screen.getByLabelText(/e-mail adresin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/şifren/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /giriş yap/i })).toBeInTheDocument();
  });

  it('shows error messages for empty fields', async () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /giriş yap/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/e-posta adresi zorunludur/i)).toBeInTheDocument();
    expect(await screen.findByText(/şifre zorunludur/i)).toBeInTheDocument();
  });

  it('shows error message for invalid email', async () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/e-mail adresin/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByRole('button', { name: /giriş yap/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/geçerli bir e-posta adresi giriniz/i)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockToken = 'mock-token';
    const mockProfile = {
      _id: '1',
      profileInfo: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
      },
    };

    (api.auth.login as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { token: mockToken },
    });

    (api.auth.getProfile as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockProfile,
    });

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/e-mail adresin/i);
    const passwordInput = screen.getByLabelText(/şifren/i);
    const submitButton = screen.getByRole('button', { name: /giriş yap/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.auth.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    });
  });

  it('shows error message for failed login', async () => {
    (api.auth.login as jest.Mock).mockResolvedValueOnce({
      success: false,
    });

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/e-mail adresin/i);
    const passwordInput = screen.getByLabelText(/şifren/i);
    const submitButton = screen.getByRole('button', { name: /giriş yap/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email veya şifre hatalı/i)).toBeInTheDocument();
    });
  });
}); 