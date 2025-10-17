import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from '../components/AuthForm';
import * as AuthServices from '../services/AuthServices';
import useAuthStore from '../store/authStore';
import { vi } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

vi.mock('../services/AuthServices');
vi.mock('../store/authStore');

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('AuthForm completo', () => {
    let loginToStoreMock;

    beforeEach(() => {
        loginToStoreMock = vi.fn();
        useAuthStore.mockReturnValue({ login: loginToStoreMock });
        vi.clearAllMocks();
    });

    const fillRegisterForm = ({ name, email, password, confirmPassword }) => {
        if (name !== undefined) fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: name } });
        if (email !== undefined) fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: email } });
        if (password !== undefined) fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: password } });
        if (confirmPassword !== undefined)
            fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: confirmPassword } });
    };

    test("renderiza formulario de registro", () => {
        render(
            <MemoryRouter>
                <AuthForm mode="register" />
            </MemoryRouter>
        );

        // Título
        expect(screen.getByText(/REGISTRARSE/i)).toBeInTheDocument();

        // Inputs por label
        expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();

        // Contraseña y Confirmar Contraseña usando getAllByText
        expect(screen.getAllByText(/Contraseña/i).length).toBeGreaterThan(0);
        expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeInTheDocument();
    });

    test("renderiza formulario de login", () => {
        render(
            <MemoryRouter>
                <AuthForm mode="login" />
            </MemoryRouter>
        );

        // Título (hay varios elementos con el mismo texto, usamos el primero)
        const titulo = screen.getAllByText(/INICIA SESIÓN/i)[0];
        expect(titulo).toBeInTheDocument();

        // El input de Nombre no debe estar
        expect(screen.queryByLabelText(/Nombre/i)).not.toBeInTheDocument();

        // Inputs email y contraseña
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Contraseña/i).length).toBeGreaterThan(0);
    });


    // test('muestra errores si registro se envía vacío', async () => {
    //     renderWithRouter(<AuthForm mode="register" />);
    //     fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    //     await waitFor(() => {
    //         expect(screen.getByText(/El nombre es obligatorio/i)).toBeInTheDocument();
    //         expect(screen.getByText(/El email es obligatorio/i)).toBeInTheDocument();
    //         expect(screen.getByText(/La contraseña es obligatoria/i)).toBeInTheDocument();
    //         expect(screen.getByText(/Debes confirmar tu contraseña/i)).toBeInTheDocument();
    //     });
    // });

    test('muestra error si passwords no coinciden', async () => {
        renderWithRouter(<AuthForm mode="register" />);
        fillRegisterForm({ name: 'Test', email: 'test@test.com', password: 'Abcde', confirmPassword: 'Abcdef' });
        fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
        });
    });

    // test('muestra error si email inválido', async () => {
    //     renderWithRouter(<AuthForm mode="register" />);
    //     fillRegisterForm({ name: 'Test', email: 'correo-invalido', password: 'Abcde', confirmPassword: 'Abcde' });
    //     fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    //     await waitFor(() => {
    //         expect(screen.getByText(/Introduce un email válido/i)).toBeInTheDocument();
    //     });
    // });

    test('llama a register y loginToStore al enviar registro válido', async () => {
        AuthServices.register.mockResolvedValue({ token: '123', user: { username: 'Test' } });
        renderWithRouter(<AuthForm mode="register" />);
        fillRegisterForm({ name: 'Test', email: 'test@test.com', password: 'AbcdeF', confirmPassword: 'AbcdeF' });
        fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

        await waitFor(() => {
            expect(AuthServices.register).toHaveBeenCalled();
            expect(loginToStoreMock).toHaveBeenCalledWith({ username: 'Test' }, '123');
        });
    });

    test('llama a login y loginToStore al iniciar sesión válido', async () => {
        AuthServices.login.mockResolvedValue({ token: '456', user: { username: 'User' } });
        renderWithRouter(<AuthForm mode="login" />);
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@test.com' } });
        fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'AbcdeF' } });
        fireEvent.click(screen.getByRole('button', { name: /Iniciar/i }));

        await waitFor(() => {
            expect(AuthServices.login).toHaveBeenCalled();
            expect(loginToStoreMock).toHaveBeenCalledWith({ username: 'User' }, '456');
        });
    });

    test('muestra error general si login falla', async () => {
        AuthServices.login.mockRejectedValue({ response: { status: 400 } });
        renderWithRouter(<AuthForm mode="login" />);
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@test.com' } });
        fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'AbcdeF' } });
        fireEvent.click(screen.getByRole('button', { name: /Iniciar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Datos incorrectos/i)).toBeInTheDocument();
        });
    });
});
