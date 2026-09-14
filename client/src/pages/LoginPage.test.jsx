import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError } from 'axios';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../context/auth-context';
import LoginPage from './LoginPage';

function renderLogin(login) {
  return render(
    <AuthContext value={{ user: null, isRestoringSession: false, login }}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthContext>,
  );
}

describe('LoginPage', () => {
  it('submits the credentials', async () => {
    const login = vi.fn().mockResolvedValue({ name: 'Jane' });
    renderLogin(login);

    await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(login).toHaveBeenCalledWith({ email: 'jane@example.com', password: 'password123' });
  });

  it("shows the server's message when the credentials are wrong", async () => {
    const response = { status: 401, data: { message: 'Invalid email or password' } };
    const login = vi
      .fn()
      .mockRejectedValue(new AxiosError('401', 'ERR_BAD_REQUEST', {}, null, response));
    renderLogin(login);

    await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'wrong-password');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
    expect(screen.getByRole('button', { name: 'Log in' })).toBeEnabled();
  });
});
