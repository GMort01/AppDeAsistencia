export interface Estudiante {
  id: string;
  nombre: string;
  celular: string;
}

// Datos de prueba para simular una base de datos real
export const listaEstudiantes: Estudiante[] = [
  { id: '1010', nombre: 'Karen Peralta', celular: '3001234567' },
  { id: '2020', nombre: 'Manuel Gómez', celular: '3109876543' },
  { id: '3030', nombre: 'Andrea Casallas', celular: '3205554433' },
];

/**
 * Función para buscar si un estudiante existe y sus datos coinciden
 */
export const validarIdentidadEstudiante = (id: string, celular: string): boolean => {
  return listaEstudiantes.some(est => est.id === id && est.celular === celular);
};