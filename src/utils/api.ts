import axios, { AxiosInstance } from 'axios';

interface ApiConfig {
    baseURL: string;
}

interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

class ApiService {
    private client: AxiosInstance;
    private token: string | null = null;

    constructor(config: ApiConfig) {
        this.client = axios.create({
            baseURL: config.baseURL,
        });
    }

    setToken(token: string): void {
        this.token = token;
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    clearToken(): void {
        this.token = null;
        delete this.client.defaults.headers.common['Authorization'];
    }

    async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        try {
            if (!this.token) {
                throw new Error('Token no configurado');
            }

            const response = await this.client.post<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(`Error en llamada a API ${endpoint}:`, error);
            throw error;
        }
    }

    postInBackground<T>(endpoint: string, data: any): void {
        this.post<T>(endpoint, data)
            .then(response => {
                console.log(`Respuesta de API ${endpoint}:`, response);
            })
            .catch(error => {
                console.error(`Error en llamada a API ${endpoint}:`, error);
            });
    }
}

// Instancias de API para diferentes servicios
export const validationApi = new ApiService({
    baseURL: 'https://api.ejemplo.com/validation',
});

export const processingApi = new ApiService({
    baseURL: 'https://api.ejemplo.com/processing',
}); 