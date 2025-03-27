import { validationApi, processingApi } from './utils/api';
import { authManager } from './utils/auth';

interface ValidationResponse {
    isValid: boolean;
    message: string;
}

interface ProcessingResponse {
    success: boolean;
    message: string;
}

/**
 * Configura el token de autenticación para todas las APIs
 * @param token - Token de autenticación
 * @throws Error si el token está vacío
 */
export function configureToken(token: string): void {
    if (!token) {
        throw new Error('El token no puede estar vacío');
    }
    authManager.configure(token);
}

/**
 * Limpia la configuración de autenticación
 */
export function clearToken(): void {
    authManager.clear();
}

/**
 * Función principal que guarda el registro enviando el texto a la API
 * @param text - Texto a guardar
 * @returns boolean
 * @throws Error si no hay token configurado
 */
export async function saveStatistics(text: string): Promise<boolean> {
    if (!authManager.hasToken()) {
        throw new Error('No hay token configurado. Use configureToken() primero.');
    }

    try {
        // Validación a través de API
        const validationResult = await validationApi.post<ValidationResponse>('/validate', { text });
        
        if (!validationResult.data.isValid) {
            return false;
        }

        // Procesamiento en segundo plano
        processingApi.postInBackground<ProcessingResponse>('/process', { text });

        return true;
    } catch (error) {
        console.error('Error en la validación:', error);
        return false;
    }
}

export default saveStatistics; 