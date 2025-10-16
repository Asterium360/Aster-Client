import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';
import '@testing-library/jest-dom';

describe('Footer component', () => {
    test('se renderiza correctamente', () => {
        render(<Footer />);

        const footerElement = screen.getByRole('contentinfo'); // <footer> usa role="contentinfo"
        expect(footerElement).toBeInTheDocument();
    });

    test('muestra el año actual', () => {
        render(<Footer />);
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    });

    test('contiene el enlace a Factoría F5', () => {
        render(<Footer />);
        const link = screen.getByRole('link', { name: /Factoría F5/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://factoriaf5.org');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('muestra el texto informativo', () => {
        render(<Footer />);
        expect(
            screen.getByText(/Creado con ❤️ para Bootcamp Femcoders Madrid/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Todos los contenidos tienen fines educativos/i)
        ).toBeInTheDocument();
    });
});
