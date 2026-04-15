// Mobile/utils/deviceId.ts
// Genera y persiste un UUID único por instalación de la app.
// - Nativo (iOS/Android): almacenado cifrado en SecureStore
// - Web: almacenado en localStorage (no cifrado, suficiente para demo)

import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

const CLAVE_V2 = 'sa_device_id_v2';
const CLAVE_LEGACY = 'sa_device_uuid';

function generarUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}

const obtenerIdNativoEstable = async (): Promise<string | null> => {
    if (Platform.OS === 'android') {
        const androidId = Application.getAndroidId() || null;
        return androidId ? `a:${androidId}` : null;
    }
    if (Platform.OS === 'ios') {
        const iosId = await Application.getIosIdForVendorAsync();
        return iosId ? `i:${iosId}` : null;
    }
    return null;
};

export const obtenerDeviceId = async (): Promise<string> => {
    if (Platform.OS === 'web') {
        let id = localStorage.getItem(CLAVE_V2);
        if (!id) {
            id = generarUUID();
            localStorage.setItem(CLAVE_V2, id);
        }
        return id;
    }

    // 1) Si ya existe ID V2, usarlo
    let id = await SecureStore.getItemAsync(CLAVE_V2);
    if (id) return id;

    // 2) Intentar ID nativo estable de hardware
    const idNativo = await obtenerIdNativoEstable();
    if (idNativo) {
        await SecureStore.setItemAsync(CLAVE_V2, idNativo);
        return idNativo;
    }

    // 3) Compatibilidad con ID legacy
    id = await SecureStore.getItemAsync(CLAVE_LEGACY);
    if (!id) {
        id = generarUUID();
        await SecureStore.setItemAsync(CLAVE_LEGACY, id);
    }
    await SecureStore.setItemAsync(CLAVE_V2, id);
    return id;
};

export const obtenerDeviceIdsCompat = async (): Promise<{ principal: string; secundario?: string }> => {
    const principal = await obtenerDeviceId();

    if (Platform.OS === 'web') {
        const legacy = localStorage.getItem(CLAVE_LEGACY) || undefined;
        if (legacy && legacy !== principal) {
            return { principal, secundario: legacy };
        }
        return { principal };
    }

    const legacy = await SecureStore.getItemAsync(CLAVE_LEGACY) || undefined;
    if (legacy && legacy !== principal) {
        return { principal, secundario: legacy };
    }
    return { principal };
};
