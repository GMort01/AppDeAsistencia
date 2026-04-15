// NUEVO: Definimos qué es un estudiante aquí mismo, borrando el import
export interface Estudiante {
  id: string;
  nombre: string;
}

export interface Clase {
  id: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  fecha: string;
  asistenciaAbierta?: boolean;
  asistentes: Estudiante[];
}

export let listaClases: Clase[] = [];

export const guardarClase = (nuevaClase: Clase) => {
  listaClases.push(nuevaClase);
};

export const eliminarClase = (id: string) => {
  listaClases = listaClases.filter(clase => clase.id !== id);
};