import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Base del API (incluye /api). Orden de prioridad:
 * 1) EXPO_PUBLIC_API_URL en .env (ej: http://192.168.1.5:3000/api)
 * 2) Web → localhost
 * 3) Expo en desarrollo → misma IP que Metro (hostUri)
 * 4) Android emulador → 10.0.2.2
 * 5) iOS simulador / fallback → localhost
 */
function resolveApiUrl(): string {
  const env = process.env.EXPO_PUBLIC_API_URL;
  if (env && env.trim().length > 0) {
    return env.trim().replace(/\/$/, '');
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri && typeof hostUri === 'string') {
    const host = hostUri.split(':')[0];
    if (host) {
      return `http://${host}:3000/api`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }

  return 'http://localhost:3000/api';
}

export const API_URL = resolveApiUrl();

if (__DEV__) {
  console.log('[SmartAttendance] API_URL =', API_URL);
}

const FETCH_TIMEOUT_MS = 20000;

export type PostJsonResult = { ok: boolean; status: number; data: Record<string, unknown> };

/** POST JSON con timeout y cuerpo parseado aunque el servidor devuelva HTML o texto */
export async function postJson(relPath: string, body: object): Promise<PostJsonResult> {
  const url = `${API_URL}${relPath.startsWith('/') ? '' : '/'}${relPath}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await response.text();
    let data: Record<string, unknown> = {};
    if (text) {
      try {
        data = JSON.parse(text) as Record<string, unknown>;
      } catch {
        data = { mensaje: `Respuesta no JSON (${response.status}): ${text.slice(0, 120)}` };
      }
    }
    return { ok: response.ok, status: response.status, data };
  } catch (e: unknown) {
    const name = e && typeof e === 'object' && 'name' in e ? String((e as { name?: string }).name) : '';
    if (name === 'AbortError') {
      return {
        ok: false,
        status: 0,
        data: {
          mensaje:
            'Tiempo de espera agotado. Comprueba que el servidor esté en ejecución (npm run dev en server/) y que API_URL sea correcta (consola Metro).',
        },
      };
    }
    return {
      ok: false,
      status: 0,
      data: { mensaje: 'No hay conexión con el servidor. Revisa red, firewall y la URL del API.' },
    };
  } finally {
    clearTimeout(timer);
  }
}
