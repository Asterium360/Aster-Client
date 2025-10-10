import '@testing-library/jest-dom';

// src/test/Footer.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Button from './Button';

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
    // action que resuelve tras un pequeño delay
    const action = jest.fn(() => new Promise((resolve) => setTimeout(() => resolve('OK'), 50)));
    render(<Button title="Enviar" action={action} data-testid="btn-async" />);

    const btn = screen.getByTestId('btn-async');
    fireEvent.click(btn);

    // mientras la promesa está pendiente, el texto debe cambiar y el botón estar deshabilitado
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/Cargando \.\.\./i);

    // espera a que action sea llamado y a que el loading termine
    await waitFor(() => expect(action).toHaveBeenCalledTimes(1), { timeout: 200 });
    await waitFor(() => expect(btn).not.toBeDisabled(), { timeout: 200 });
    // ahora vuelve el texto original
    expect(btn).toHaveTextContent('Enviar');
  });

  test('si action rechaza, captura el error y termina el loading', async () => {
    const error = new Error('boom');
    const action = jest.fn(() => Promise.reject(error));
    // es buena idea espiar console.error para evitar ruido en la salida de test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Button title="Borrar" action={action} data-testid="btn-error" />);

    const btn = screen.getByTestId('btn-error');
    fireEvent.click(btn);

    // mientras la promesa está en curso
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/Cargando \.\.\./i);

    // espera la resolución del catch/finally
    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(btn).not.toBeDisabled());

    // restaurar spy
    consoleErrorSpy.mockRestore();
    expect(btn).toHaveTextContent('Borrar');
  });

  test('si no se pasa action, al hacer click no falla y no hace nada', () => {
    render(<Button title="SoloMostrar" data-testid="btn-noaction" />);
    const btn = screen.getByTestId('btn-noaction');

    // no debe lanzar
    expect(() => {
      fireEvent.click(btn);
    }).not.toThrow();

    // texto sigue igual y no está disabled
    expect(btn).toHaveTextContent('SoloMostrar');
    expect(btn).not.toBeDisabled();
  });

  test('usa data-testid correctamente cuando se pasa como prop (atributo personalizado)', () => {
    render(<Button title="Prueba" data-testid="mi-testid" />);
    expect(screen.getByTestId('mi-testid')).toBeInTheDocument();
  });
});
