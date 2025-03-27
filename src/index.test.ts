import { saveStatistics, configureToken, clearToken } from './index';
import { validationApi, processingApi } from './utils/api';
import { authManager } from './utils/auth';

// Mock de las APIs y AuthManager
jest.mock('./utils/api', () => ({
    validationApi: {
        post: jest.fn(),
        setToken: jest.fn(),
        clearToken: jest.fn(),
    },
    processingApi: {
        postInBackground: jest.fn(),
        setToken: jest.fn(),
        clearToken: jest.fn(),
    },
}));

jest.mock('./utils/auth', () => ({
    authManager: {
        configure: jest.fn(),
        clear: jest.fn(),
        hasToken: jest.fn(),
    },
}));

describe('Autenticación', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('configureToken', () => {
        it('debería configurar el token correctamente', () => {
            const token = 'test-token';
            configureToken(token);
            expect(authManager.configure).toHaveBeenCalledWith(token);
        });

        it('debería lanzar error si el token está vacío', () => {
            expect(() => configureToken('')).toThrow('El token no puede estar vacío');
        });
    });

    describe('clearToken', () => {
        it('debería limpiar la configuración de autenticación', () => {
            clearToken();
            expect(authManager.clear).toHaveBeenCalled();
        });
    });
});

describe('saveStatistics', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (authManager.hasToken as jest.Mock).mockReturnValue(true);
    });

    it('debería lanzar error si no hay token configurado', async () => {
        (authManager.hasToken as jest.Mock).mockReturnValue(false);
        await expect(saveStatistics('texto')).rejects.toThrow('No hay token configurado');
    });

    it('debería retornar false cuando la validación falla', async () => {
        (validationApi.post as jest.Mock).mockResolvedValueOnce({
            data: { isValid: false, message: 'Texto inválido' }
        });

        const result = await saveStatistics('texto inválido');
        expect(result).toBe(false);
        expect(validationApi.post).toHaveBeenCalledWith('/validate', { text: 'texto inválido' });
        expect(processingApi.postInBackground).not.toHaveBeenCalled();
    });

    it('debería retornar true cuando la validación es exitosa', async () => {
        (validationApi.post as jest.Mock).mockResolvedValueOnce({
            data: { isValid: true, message: 'Texto válido' }
        });

        const result = await saveStatistics('texto válido');
        expect(result).toBe(true);
        expect(validationApi.post).toHaveBeenCalledWith('/validate', { text: 'texto válido' });
        expect(processingApi.postInBackground).toHaveBeenCalledWith('/process', { text: 'texto válido' });
    });

    it('debería retornar false cuando hay un error en la validación', async () => {
        (validationApi.post as jest.Mock).mockRejectedValueOnce(new Error('Error de API'));

        const result = await saveStatistics('texto válido');
        expect(result).toBe(false);
        expect(validationApi.post).toHaveBeenCalledWith('/validate', { text: 'texto válido' });
        expect(processingApi.postInBackground).not.toHaveBeenCalled();
    });
}); 