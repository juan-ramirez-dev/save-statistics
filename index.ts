/**
 * Módulo para manejar el envío de texto con UUID a una API
 */

// Almacenamiento del UUID
let savedUUID: string | null = null;

/**
 * Guarda un UUID para uso posterior
 * @param uuid El UUID a guardar
 */
export function setUUID(uuid: string): void {
  savedUUID = uuid;
}

/**
 * Envía texto junto con el UUID guardado a una API
 * @param text El texto a enviar
 * @returns Promise que resuelve sin valor en caso de éxito o rechaza con un error
 * @throws Error si no hay UUID guardado o si la API responde con error
 */
export async function sendText(text: string): Promise<void> {
  if (!savedUUID) {
    throw new Error('No se ha configurado un UUID. Llame a setUUID primero.');
  }

  const payload = {
    uuid: savedUUID,
    text
  };

  try {
    const response = await fetch('http://localhost:3000/click-statistics/simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error al enviar datos: ${response.status} ${response.statusText}`);
    }
    
    // Si llegamos aquí, la operación fue exitosa (no devolvemos true como se solicitó)
  } catch (error) {
    // Relanzamos el error para que el llamador pueda manejarlo
    throw error instanceof Error 
      ? error 
      : new Error('Error desconocido al enviar datos');
  }
}
