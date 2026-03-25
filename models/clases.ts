// 1. Definimos la estructura de lo que es una "Clase" según el taller 
export interface Clase {
  id: string;          // Un identificador único (ej: un timestamp)
  nombre: string;      // Nombre de la asignatura 
  horaInicio: string;  // Formato HH:mm 
  horaFin: string;     // Formato HH:mm 
  fecha: string;       // Para saber de qué día es la asistencia
}

// 2. Esta es nuestra "Base de Datos" temporal en memoria 
// Empezamos con un arreglo vacío.
export const listaClases: Clase[] = [];

/**
 * Función para agregar una nueva clase a la lista.
 * Esto es lo que llamaremos desde el ProfesorView.
 */
export const guardarClase = (nuevaClase: Clase) => {
  listaClases.push(nuevaClase);
  console.log("Estado actual de la memoria:", listaClases);
};