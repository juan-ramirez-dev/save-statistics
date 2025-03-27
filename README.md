# Save Statistics

Una librería TypeScript que valida texto y procesa información usando APIs separadas.

## Instalación

```bash
npm install save-statistics
# o
yarn add save-statistics
```

## Uso

```typescript
import { saveStatistics, configureToken, clearToken } from 'save-statistics';

// Configurar el token de autenticación
configureToken('tu-token-aqui');

// Guardar el registro enviando el texto a la API
try {
    const result = await saveStatistics('texto a guardar'); // retorna Promise<boolean>
    console.log('Resultado:', result);
} catch (error) {
    console.error('Error:', error.message);
}

// Limpiar la configuración cuando sea necesario
clearToken();
```

## Características

- Validación a través de API externa
- Procesamiento en segundo plano
- Manejo de errores robusto
- Tipado completo con TypeScript
- Utilidad de API reutilizable
- Sistema de autenticación centralizado

## Flujo de Proceso

1. **Configuración**: Se debe configurar un token de autenticación usando `configureToken()`
2. **Guardar Registro**: El texto se envía a la API para validación y procesamiento
3. **Resultado**: Retorna true si la validación es exitosa, false en caso contrario
4. **Limpieza**: Se puede limpiar la configuración con `clearToken()`

## API

### `configureToken(token: string): void`

- **Parámetros:**
  - `token`: Token de autenticación para las APIs
- **Descripción:** Configura el token de autenticación para todas las llamadas a API
- **Lanza:** Error si el token está vacío

### `clearToken(): void`

- **Descripción:** Limpia la configuración de autenticación actual

### `saveStatistics(text: string): Promise<boolean>`

- **Parámetros:**
  - `text`: Texto a guardar
- **Retorna:** `Promise<boolean>`
  - `true`: Si la validación es exitosa
  - `false`: Si la validación falla o hay un error
- **Lanza:** Error si no hay token configurado

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Construir la librería
npm run build
```

## Licencia

MIT 