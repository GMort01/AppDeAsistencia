import { API_URL } from '../constants/api';

export const crearClase = async (
    nombreClase: string,
    profesorId: string,
    horaInicio: string,
    horaFin: string,
    fechaClase: string
) => {
    try {
        const response = await fetch(`${API_URL}/clases`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre_clase: nombreClase,
                profesor_id: profesorId,
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                fecha_clase: fechaClase,
            }),
        });

        return await response.json();
    } catch (error) {
        console.error('Error creando clase:', error);
        return { exito: false, mensaje: 'No se pudo conectar al servidor.' };
    }
};

export const listarClasesProfesor = async (profesorId: string) => {
    try {
        const response = await fetch(`${API_URL}/clases/profesor/${profesorId}`);
        return await response.json();
    } catch (error) {
        console.error('Error listando clases:', error);
        return { exito: false, clases: [] };
    }
};

export const eliminarClaseServer = async (claseId: string, profesorId: string) => {
    try {
        const response = await fetch(
            `${API_URL}/clases/${claseId}?profesor_id=${encodeURIComponent(profesorId)}`,
            { method: 'DELETE' }
        );
        return await response.json();
    } catch (error) {
        console.error('Error eliminando clase:', error);
        return { exito: false, mensaje: 'No se pudo conectar al servidor.' };
    }
};

export const actualizarEstadoClase = async (claseId: string, profesorId: string, asistenciaAbierta: boolean) => {
    try {
        const response = await fetch(`${API_URL}/clases/${claseId}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profesor_id: profesorId, asistencia_abierta: asistenciaAbierta }),
        });

        return await response.json();
    } catch (error) {
        console.error('Error actualizando estado de clase:', error);
        return { exito: false, mensaje: 'No se pudo conectar al servidor.' };
    }
};
