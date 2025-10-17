import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../components/NavBar";
import '@testing-library/jest-dom';


// 🧠 Mock Zustand
vi.mock("../store/authStore", () => {
    return {
        __esModule: true,
        default: vi.fn((selector) =>
            selector({
                isAuthenticated: false,
                user: null,
                logout: vi.fn(),
            })
        ),
    };
});

import useAuthStore from "../store/authStore";

describe("NavBar", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // 🧭 --- Desktop Tests ---
    it("renderiza los links principales en desktop", () => {
        useAuthStore.mockImplementation((selector) =>
            selector({
                isAuthenticated: false,
                user: null,
                logout: vi.fn(),
            })
        );

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByTestId("link-home")).toBeInTheDocument();
        expect(screen.getByTestId("link-explore")).toBeInTheDocument();
        expect(screen.getByTestId("link-about")).toBeInTheDocument();
        expect(screen.getByTestId("link-contact")).toBeInTheDocument();
        expect(screen.getByTestId("link-jugar")).toBeInTheDocument();
        expect(screen.queryByTestId("link-admin")).toBeNull();
    });

    it("muestra Login y SignUp cuando el usuario NO está autenticado", () => {
        useAuthStore.mockImplementation((selector) =>
            selector({
                isAuthenticated: false,
                user: null,
                logout: vi.fn(),
            })
        );

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByTestId("login-button")).toBeInTheDocument();
        expect(screen.getByTestId("signup-button")).toBeInTheDocument();
        expect(screen.queryByTestId("logout-button")).toBeNull();
    });

    it("muestra Logout cuando el usuario está autenticado", () => {
        useAuthStore.mockImplementation((selector) =>
            selector({
                isAuthenticated: true,
                user: { id: 1, role: "user" },
                logout: vi.fn(),
            })
        );

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByTestId("logout-button")).toBeInTheDocument();
        expect(screen.queryByTestId("login-button")).toBeNull();
        expect(screen.queryByTestId("signup-button")).toBeNull();
    });

    it("muestra el link de Admin solo cuando el usuario es admin", () => {
        // Caso usuario normal
        useAuthStore.mockImplementation((selector) =>
            selector({
                isAuthenticated: true,
                user: { id: 1, role: "user" },
                logout: vi.fn(),
            })
        );

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.queryByTestId("link-admin")).toBeNull();

        // Caso admin
        useAuthStore.mockImplementation((selector) =>
            selector({
                isAuthenticated: true,
                user: { id: 1, role: "admin" },
                logout: vi.fn(),
            })
        );

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByTestId("link-admin")).toBeInTheDocument();
    });

    // 📱 --- Mobile Tests ---
    it("abre el menú mobile y muestra links principales", () => {
        useAuthStore.mockImplementation((selector) =>
            selector({
                isAuthenticated: false,
                user: null,
                logout: vi.fn(),
            })
        );

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        const burgerButton = screen.getByRole("button", { name: /☰/ });
        fireEvent.click(burgerButton);

        expect(screen.getByTestId("mobile-link-home")).toBeInTheDocument();
        expect(screen.getByTestId("mobile-link-explore")).toBeInTheDocument();
        expect(screen.getByTestId("mobile-link-about")).toBeInTheDocument();
        expect(screen.getByTestId("mobile-link-contact")).toBeInTheDocument();
        expect(screen.getByTestId("mobile-link-jugar")).toBeInTheDocument();
    });

    it("muestra Login y SignUp en mobile cuando NO autenticado", () => {
        useAuthStore.mockImplementation((selector) =>
            selector({
                isAuthenticated: false,
                user: null,
                logout: vi.fn(),
            })
        );

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /☰/ }));

        expect(screen.getByTestId("mobile-login-button")).toBeInTheDocument();
        expect(screen.getByTestId("mobile-signup-button")).toBeInTheDocument();
        expect(screen.queryByTestId("mobile-logout-button")).toBeNull();
    });

    it("muestra Logout en mobile cuando el usuario está autenticado", () => {
        useAuthStore.mockImplementation((selector) =>
            selector({
                isAuthenticated: true,
                user: { id: 1, role: "user" },
                logout: vi.fn(),
            })
        );

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /☰/ }));

        expect(screen.getByTestId("mobile-logout-button")).toBeInTheDocument();
        expect(screen.queryByTestId("mobile-login-button")).toBeNull();
        expect(screen.queryByTestId("mobile-signup-button")).toBeNull();
    });

    it("muestra el link Admin en mobile solo para admin", () => {
        // Usuario normal
        useAuthStore.mockImplementation((selector) =>
            selector({
                isAuthenticated: true,
                user: { id: 1, role: "user" },
                logout: vi.fn(),
            })
        );

        const { unmount } = render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /☰/ }));
        expect(screen.queryByTestId("mobile-link-admin")).toBeNull();

        // Admin
        unmount();
        useAuthStore.mockImplementation((selector) =>
            selector({
                isAuthenticated: true,
                user: { id: 1, role: "admin" },
                logout: vi.fn(),
            })
        );

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /☰/ }));
        expect(screen.getByTestId("mobile-link-admin")).toBeInTheDocument();
    });
});
