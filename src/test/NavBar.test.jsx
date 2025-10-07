// src/test/NavBar.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import NavBar from "../components/NavBar";
import '@testing-library/jest-dom';


// Mock de Zustand
vi.mock("../store/authStore", () => ({
    useAuthStore: vi.fn(),
}));

describe("NavBar", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("muestra Logout cuando el usuario está autenticado", () => {
        // Simular usuario autenticado
        useAuthStore.mockImplementation((selector) => selector({
            isAuthenticated: true,
            logout: vi.fn(),
        }));

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        const logoutButton = screen.getByTestId("logout-button");
        expect(logoutButton).toBeInTheDocument();

        // Login/SignUp no deberían aparecer
        expect(screen.queryByTestId("login-button")).toBeNull();
        expect(screen.queryByTestId("signup-button")).toBeNull();
    });

    it("muestra Login/SignUp cuando NO autenticado", () => {
        // Simular usuario NO autenticado
        useAuthStore.mockImplementation((selector) => selector({
            isAuthenticated: false,
            logout: vi.fn(),
        }));

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        const loginButton = screen.getByTestId("login-button");
        const signupButton = screen.getByTestId("signup-button");

        expect(loginButton).toBeInTheDocument();
        expect(signupButton).toBeInTheDocument();

        // Logout no debería aparecer
        expect(screen.queryByTestId("logout-button")).toBeNull();
    });
});
