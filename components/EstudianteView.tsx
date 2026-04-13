import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// IMPORTANTE: Importamos la interfaz Clase también
import { Clase, registrarAsistencia } from '../models/clases';

interface EstudianteViewProps {
  onBack: () => void;
  user: {
    id: string;
    nombre: string;
    celular: string;
  };
}

const EstudianteView = ({ onBack, user }: EstudianteViewProps) => {
  const [permiso, pedirPermiso] = useCameraPermissions();
  const [escaneando, setEscaneando] = useState(false);


  // NUEVO: Estado para saber si ya estamos dentro de una clase viendo la lista
  const [claseActual, setClaseActual] = useState<Clase | null>(null);

  if (!permiso) {
    return <View style={styles.container} />;
  }

  if (!permiso.granted) {
    return (
      <View style={styles.containerCenter}>
        <Text style={styles.mensaje}>Necesitamos permiso para usar la cámara y escanear el QR.</Text>
        <TouchableOpacity style={styles.boton} onPress={pedirPermiso}>
          <Text style={styles.botonTexto}>Otorgar Permiso</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.boton, styles.botonVolver]} onPress={onBack}>
          <Text style={styles.botonTexto}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const iniciarEscaneo = () => {
    setEscaneando(true);
  };

  const handleQRDetectado = (resultado: { data: string }) => {
    setEscaneando(false);
    const partes = resultado.data.split('-');

    if (partes[0] === 'CLASE' && partes.length >= 2) {
      const claseId = partes[1];

      const nuevoEstudiante = { id: user.id, nombre: user.nombre };
      const resultadoRegistro = registrarAsistencia(claseId, nuevoEstudiante);

      if (resultadoRegistro.exito && resultadoRegistro.clase) {
        Alert.alert("¡Éxito!", resultadoRegistro.mensaje);
        // Mágia: Guardamos la clase y la pantalla cambiará a la lista
        setClaseActual(resultadoRegistro.clase);
      } else {
        Alert.alert("Aviso", resultadoRegistro.mensaje);
      }
    } else {
      Alert.alert("Error", "Este código QR no es válido para asistencia.");
    }
  };



  // --- NUEVA VISTA: MODO LECTURA PARA EL ESTUDIANTE ---
  if (claseActual) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setClaseActual(null)} style={styles.backButton}>
          <Text style={styles.backText}>← Volver al escáner</Text>
        </TouchableOpacity>

        <View style={styles.headerLectura}>
          <Text style={styles.title}>{claseActual.nombre}</Text>
          <Text style={styles.info}>{claseActual.fecha} | {claseActual.horaInicio} - {claseActual.horaFin}</Text>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>
            Compañeros Presentes ({claseActual.asistentes?.length || 0})
          </Text>

          <FlatList
            data={claseActual.asistentes || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[
                styles.studentRow,
                // Resaltamos al propio usuario en la lista
                item.id === user.id ? styles.miFila : null
              ]}>
                <Text style={[styles.studentName, item.id === user.id && styles.miTexto]}>
                  {item.nombre} {item.id === user.id && "(Tú)"}
                </Text>
                <Text style={[styles.studentId, item.id === user.id && styles.miTexto]}>ID: {item.id}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Eres el primero en llegar.</Text>
            }
          />
        </View>
      </View>
    );


  }
  // ----------------------------------------------------

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Salir al Inicio</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Panel de Estudiante</Text>

      {escaneando ? (
        <View style={styles.camaraContainer}>
          <CameraView
            style={styles.camara}
            facing="back"
            onBarcodeScanned={handleQRDetectado}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />
          <TouchableOpacity style={styles.cancelarBoton} onPress={() => setEscaneando(false)}>
            <Text style={styles.cancelarTexto}>Cancelar Escaneo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.instrucciones}>
            Bienvenid@ {user.nombre}. Escanea el QR del profesor.
          </Text>
          <TouchableOpacity style={styles.botonEscanear} onPress={iniciarEscaneo}>
            <Text style={styles.botonEscanearTexto}>📷 Escanear QR</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  backButton: { marginTop: 40, marginBottom: 20 },
  backText: { color: '#007AFF', fontSize: 16 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#212529' },
  mensaje: { textAlign: 'center', marginBottom: 20, fontSize: 16 },
  boton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginBottom: 10, width: '100%', alignItems: 'center' },
  botonVolver: { backgroundColor: '#6c757d' },
  botonTexto: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  infoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  formulario: { width: '100%', backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 2 },
  label: { fontWeight: 'bold', color: '#495057', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#dee2e6', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: '#f8f9fa' },
  instrucciones: { textAlign: 'center', fontSize: 16, color: '#495057', marginBottom: 30, paddingHorizontal: 20 },
  botonEscanear: { backgroundColor: '#28a745', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 15, elevation: 3 },
  botonEscanearTexto: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  camaraContainer: { flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: '#000', marginBottom: 20 },
  camara: { flex: 1 },
  cancelarBoton: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#dc3545', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  cancelarTexto: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // ESTILOS NUEVOS PARA LA VISTA DE LECTURA
  headerLectura: { marginBottom: 30, backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 2 },
  info: { fontSize: 16, color: '#6c757d', marginTop: 5 },
  listSection: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  emptyText: { textAlign: 'center', color: '#adb5bd', marginTop: 40 },
  studentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingHorizontal: 10 },
  studentName: { fontSize: 16, color: '#333' },
  studentId: { fontSize: 14, color: '#888' },
  miFila: { backgroundColor: '#e8f4f8', borderRadius: 8, borderBottomWidth: 0 },
  miTexto: { fontWeight: 'bold', color: '#007AFF' }
});

export default EstudianteView;