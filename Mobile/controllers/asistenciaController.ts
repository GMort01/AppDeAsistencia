// Mobile/controllers/asistenciaController.ts
import { API_URL } from '../constants/api';
import { obtenerDeviceId, obtenerDeviceIdsCompat } from '../utils/deviceId';

export const registrarAsistencia = async (claseId: string, estudiante: any, timestampQR: string, deviceId?: string) => {
    try {
        const ids = deviceId
            ? { principal: deviceId }
            : await obtenerDeviceIdsCompat();
        const resolvedDeviceId = ids.principal || await obtenerDeviceId();
        const response = await fetch(`${API_URL}/asistencia/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                claseId,
                estudianteId: estudiante.id,
                estudianteNombre: estudiante.nombre,
                timestampQR,
                deviceId: resolvedDeviceId,
                deviceIdSecundario: ids.secundario,
            }),
        });

        const data = await response.json();
        return data; // Esto devolverá el éxito o error del servidor

    } catch (error) {
        console.error("Error de red:", error);
        return { exito: false, mensaje: "No se pudo conectar con el servidor" };
    }
};

export const obtenerAsistentesClase = async (claseId: string) => {
    try {
        const response = await fetch(`${API_URL}/asistencia/clase/${claseId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error consultando asistentes:', error);
        return { exito: false, asistentes: [] };
    }
};

export const obtenerClasesRegistradasEstudiante = async (estudianteId: string) => {
    try {
        const response = await fetch(`${API_URL}/asistencia/estudiante/${estudianteId}/clases`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error consultando clases del estudiante:', error);
        return { exito: false, clases: [] };
    }
};

export const obtenerAsistentesClaseHoy = async (claseId: string) => {
    try {
        const response = await fetch(`${API_URL}/asistencia/clase/${claseId}/hoy`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error consultando asistentes de hoy:', error);
        return { exito: false, asistentes: [] };
    }
};

// Fase 1: registrar con token HMAC firmado (el claseId viaja dentro del token)
export const registrarAsistenciaConToken = async (tokenQR: string, estudiante: { id: string; nombre: string }, deviceId?: string) => {
    try {
        const ids = deviceId
            ? { principal: deviceId }
            : await obtenerDeviceIdsCompat();
        const resolvedDeviceId = ids.principal || await obtenerDeviceId();
        const response = await fetch(`${API_URL}/asistencia/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                estudianteId: estudiante.id,
                tokenQR,
                deviceId: resolvedDeviceId,
                deviceIdSecundario: ids.secundario,
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error de red:', error);
        return { exito: false, mensaje: 'No se pudo conectar con el servidor' };
    }
};