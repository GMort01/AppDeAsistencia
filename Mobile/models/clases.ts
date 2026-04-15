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
  asistentes: Estudiante[];
}

export let listaClases: Clase[] = [];

export const guardarClase = (nuevaClase: Clase) => {
  listaClases.push(nuevaClase);
};

export const eliminarClase = (id: string) => {
  listaClases = listaClases.filter(clase => clase.id !== id);
};

export const registrarAsistencia = (claseId: string, estudiante: Estudiante) => {
  const clase = listaClases.find(c => c.id === claseId);
  
  if (!clase) {
    return { exito: false, mensaje: "Clase no encontrada en este dispositivo." };
  }

  // Verificamos si ya estaba registrado
  const yaRegistrado = clase.asistentes.some(e => e.id === estudiante.id);
  if (yaRegistrado) {
    // Si ya estaba, igual lo dejamos pasar a la vista de la lista
    return { exito: true, mensaje: "Ya estabas registrado en esta clase.", clase };
  }

  clase.asistentes.push(estudiante);
  return { exito: true, mensaje: `¡Registrado exitosamente en ${clase.nombre}!`, clase };
};