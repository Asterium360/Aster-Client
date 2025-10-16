import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Button from '../components/Button';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

describe('Button component', () => {
  test('renderiza el título y atributos básicos', () => {
    render(<Button title="Guardar" tooltip="Guardar cambios" type="submit" data-testid="btn-1" />);
    const btn = screen.getByTestId('btn-1');

    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('title', 'Guardar cambios');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveTextContent('Guardar');
  });

  test('al hacer click ejecuta action async y muestra estado loading', async () => {
    const action = vi.fn(() => new Promise((resolve) => setTimeout(() => resolve('OK'), 50)));
    render(<Button title="Enviar" action={action} data-testid="btn-async" />);

    const btn = screen.getByTestId('btn-async');
    fireEvent.click(btn);

    // mientras la promesa está pendiente
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/Cargando \.\.\./i);

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1), { timeout: 200 });
    await waitFor(() => expect(btn).not.toBeDisabled(), { timeout: 200 });

    expect(btn).toHaveTextContent('Enviar');
  });

  test('si action rechaza, captura el error y termina el loading', async () => {
    const error = new Error('boom');
    const action = vi.fn(() => Promise.reject(error));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Button title="Borrar" action={action} data-testid="btn-error" />);
    const btn = screen.getByTestId('btn-error');
    fireEvent.click(btn);

    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/Cargando \.\.\./i);

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(btn).not.toBeDisabled());

    consoleErrorSpy.mockRestore();
    expect(btn).toHaveTextContent('Borrar');
  });

  test('si no se pasa action, al hacer click no falla y no hace nada', () => {
    render(<Button title="SoloMostrar" data-testid="btn-noaction" />);
    const btn = screen.getByTestId('btn-noaction');

    expect(() => {
      fireEvent.click(btn);
    }).not.toThrow();

    expect(btn).toHaveTextContent('SoloMostrar');
    expect(btn).not.toBeDisabled();
  });

  test('usa data-testid correctamente cuando se pasa como prop (atributo personalizado)', () => {
    render(<Button title="Prueba" data-testid="mi-testid" />);
    expect(screen.getByTestId('mi-testid')).toBeInTheDocument();
  });
});
