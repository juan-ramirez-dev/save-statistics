# save-statistics

Una librería simple y eficiente para gestionar el envío de textos junto con UUID a APIs. Ideal para aplicaciones que necesitan realizar seguimiento de estadísticas o eventos con identificadores únicos.

## Instalación

```bash
npm install save-statistics
```

## Características

- 🔒 Almacenamiento seguro de UUID para identificación
- 📨 Envío de texto junto con UUID a endpoints API
- ⚛️ Compatible con React y otras librerías/frameworks
- 🔄 Manejo de promesas y errores robusto
- 📝 Completamente tipada con TypeScript

## Uso

### Configuración básica

```typescript
import { setUUID, sendText } from 'save-statistics';

// Configura el UUID al iniciar tu aplicación
setUUID('123e4567-e89b-12d3-a456-426614174000');

// Envía texto a la API (función asíncrona)
async function enviarMensaje() {
  try {
    await sendText('Mensaje de prueba');
    console.log('Mensaje enviado correctamente');
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
  }
}

enviarMensaje();
```

### Uso con React

```tsx
import React, { useState, useEffect } from 'react';
import { setUUID, sendText } from 'save-statistics';

const MessageForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Configura el UUID al montar el componente
  useEffect(() => {
    // En una aplicación real, este UUID podría venir de:
    // - Un servicio de autenticación
    // - Generarse con una librería como uuid
    // - Recuperarse del localStorage
    setUUID('123e4567-e89b-12d3-a456-426614174000');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsLoading(true);
    setStatus('');
    
    try {
      await sendText(message);
      setStatus('✅ Mensaje enviado correctamente');
      setMessage(''); // Limpiar el campo después de enviar
    } catch (error) {
      if (error instanceof Error) {
        setStatus(`❌ Error: ${error.message}`);
      } else {
        setStatus('❌ Ocurrió un error desconocido');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="message-form">
      <h2>Enviar mensaje</h2>
      
      {status && <div className={status.includes('Error') ? 'error' : 'success'}>{status}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="message">Mensaje:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            placeholder="Escribe tu mensaje aquí..."
            rows={4}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
```

## API

### `setUUID(uuid: string): void`

Guarda un UUID para uso posterior en las llamadas a la API.

- **Parámetros**:
  - `uuid`: String - El UUID a guardar
- **Comportamiento**: Almacena el UUID en memoria para usarlo en llamadas posteriores
- **Ejemplo**:
  ```typescript
  setUUID('123e4567-e89b-12d3-a456-426614174000');
  ```

### `sendText(text: string): Promise<void>`

Envía texto junto con el UUID guardado a una API.

- **Parámetros**:
  - `text`: String - El texto a enviar
- **Retorna**: Promise que se resuelve sin valor en caso de éxito
- **Lanza**: Error si no hay UUID configurado o si la API responde con error
- **Ejemplo**:
  ```typescript
  try {
    await sendText('Hola mundo');
    console.log('Texto enviado correctamente');
  } catch (error) {
    console.error('Falló el envío:', error);
  }
  ```

## Flujo de trabajo típico

1. Al inicializar la aplicación, llama a `setUUID()` con el identificador único
2. Cuando necesites enviar un texto, usa `sendText()` 
3. Maneja posibles errores con bloques try/catch

## Configuración avanzada

Para configurar una URL de API personalizada, puedes modificar el archivo `index.ts` antes de construir la librería:

```typescript
// En src/index.ts
const API_URL = 'https://tu-api-personalizada.com/endpoint';
```

## Licencia

MIT 