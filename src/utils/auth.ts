import { validationApi, processingApi } from './api';

class AuthManager {
    private static instance: AuthManager;
    private token: string | null = null;

    private constructor() {}

    static getInstance(): AuthManager {
        if (!AuthManager.instance) {
            AuthManager.instance = new AuthManager();
        }
        return AuthManager.instance;
    }

    configure(token: string): void {
        this.token = token;

        validationApi.setToken(token);
        processingApi.setToken(token);
    }

    clear(): void {
        this.token = null;

        // Limpiar token en todas las APIs
        validationApi.clearToken();
        processingApi.clearToken();
    }

    getToken(): string | null {
        return this.token;
    }

    hasToken(): boolean {
        return this.token !== null;
    }
}

export const authManager = AuthManager.getInstance(); 