import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // Asegúrate de tener esta librería instalada
import { API_URL } from '../constants/api';

interface QRGeneradorDinamicoProps {
  claseId: string;
}

const QRGeneradorDinamico = ({ claseId }: QRGeneradorDinamicoProps) => {
  const [valorQR, setValorQR] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    const actualizarToken = async () => {
      try {
        const resp = await fetch(`${API_URL}/asistencia/qr-token/${claseId}`);
        const data = await resp.json();
        if (activo && data.exito && data.token) {
          setValorQR(data.token);
          setErrorMsg(null);
        } else if (activo) {
          setErrorMsg(data.mensaje || 'No se pudo generar el código.');
        }
      } catch {
        if (activo) setErrorMsg('Sin conexión con el servidor.');
      }
    };

    // Obtener token inmediatamente y luego cada 10 segundos
    actualizarToken();
    const intervalo = setInterval(actualizarToken, 10000);

    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, [claseId]);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.textoError}>{errorMsg}</Text>
      </View>
    );
  }

  if (!valorQR) {
    return (
      <View style={styles.container}>
        <Text style={styles.textoAviso}>Generando código seguro...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QRCode
        value={valorQR}
        size={250}
        color="black"
        backgroundColor="white"
      />
      <Text style={styles.textoAviso}>Este código se actualiza cada 10s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  textoAviso: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  textoError: {
    fontSize: 13,
    color: '#dc3545',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});

export default QRGeneradorDinamico;