import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Clase, registrarAsistencia } from '../models/clases';

interface EstudianteViewProps {
  onBack: () => void;
  onLogout: () => void; 
  user: {
    id: string;
    nombre: string;
    celular?: string;
  };
}

const EstudianteView = ({ onBack, onLogout, user }: EstudianteViewProps) => {
  const [permiso, pedirPermiso] = useCameraPermissions();
  const [escaneando, setEscaneando] = useState(false);
  const [claseActual, setClaseActual] = useState<Clase | null>(null);

  if (!permiso) {
    return <View style={styles.container} />;
  }

  if (!permiso.granted) {
    return (
      <View style={styles.containerCenter}>
        <Text style={styles.mensaje}>Necesitamos permiso para usar la cámara.</Text>
        <TouchableOpacity style={styles.boton} onPress={pedirPermiso}>
          <Text style={styles.botonTexto}>Otorgar Permiso</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.boton, styles.botonVolver]} onPress={onBack}>
          <Text style={styles.botonTexto}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const confirmarCerrarSesion = () => {
    if (Platform.OS === 'web') {
      console.log('Logout directo en web');
      onLogout();
      return;
    }

    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir de tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          onPress: onLogout,
          style: "destructive",
        }
      ],
      { cancelable: true }
    );
  };

  const handleQRDetectado = (resultado: { data: string }) => {
    setEscaneando(false);
    const partes = resultado.data.split('-');

    if (partes[0] === 'CLASE' && partes.length >= 2) {
      const claseId = partes[1];
      const nuevoEstudiante = { id: user.id.toString(), nombre: user.nombre };
      const resultadoRegistro = registrarAsistencia(claseId, nuevoEstudiante);

      if (resultadoRegistro.exito && resultadoRegistro.clase) {
        Alert.alert("¡Éxito!", resultadoRegistro.mensaje);
        setClaseActual(resultadoRegistro.clase);
      } else {
        Alert.alert("Aviso", resultadoRegistro.mensaje);
      }
    } else {
      Alert.alert("Error", "QR no válido.");
    }
  };

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
          <Text style={styles.sectionTitle}>Compañeros Presentes ({claseActual.asistentes?.length || 0})</Text>
          <FlatList
            data={claseActual.asistentes || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.studentRow, item.id.toString() === user.id.toString() ? styles.miFila : null]}>
                <Text style={[styles.studentName, item.id.toString() === user.id.toString() && styles.miTexto]}>
                  {item.nombre} {item.id.toString() === user.id.toString() && "(Tú)"}
                </Text>
                <Text style={styles.studentId}>ID: {item.id}</Text>
              </View>
            )}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CORRECCIÓN: Estilo miniLogoutButton sincronizado con el StyleSheet */}
      <View style={styles.userInfoCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.userLabel}>Estudiante conectado:</Text>
          <Text style={styles.userName}>{user.nombre}</Text>
          <Text style={styles.userIdText}>ID: {user.id}</Text>
        </View>
        <TouchableOpacity 
          style={styles.miniLogoutButton} 
          onPress={confirmarCerrarSesion}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Cerrar sesión"
        >
          <Text style={styles.miniLogoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Asistencia QR</Text>

      {escaneando ? (
        <View style={styles.camaraContainer}>
          <CameraView
            style={styles.camara}
            onBarcodeScanned={handleQRDetectado}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />
          <TouchableOpacity style={styles.cancelarBoton} onPress={() => setEscaneando(false)}>
            <Text style={styles.cancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.instrucciones}>Apunta tu cámara al código QR del profesor.</Text>
          <TouchableOpacity style={styles.botonEscanear} onPress={() => setEscaneando(true)}>
            <Text style={styles.botonEscanearTexto}>📷 Escanear QR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonVolverInicio} onPress={onBack}>
             <Text style={styles.botonVolverTexto}>Volver al Menú Principal</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  userInfoCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 15, 
    marginTop: 40, 
    marginBottom: 20,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF'
  },
  userLabel: { fontSize: 12, color: '#6c757d' },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  userIdText: { fontSize: 12, color: '#007AFF' },
  // ESTO ERA LO QUE NO COINCIDÍA
  miniLogoutButton: { 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#dc3545',
    backgroundColor: '#fff' 
  },
  miniLogoutText: { color: '#dc3545', fontWeight: 'bold', fontSize: 12 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#212529' },
  backButton: { marginTop: 40, marginBottom: 20 },
  backText: { color: '#007AFF', fontSize: 16 },
  instrucciones: { textAlign: 'center', fontSize: 16, color: '#495057', marginBottom: 30 },
  botonEscanear: { backgroundColor: '#28a745', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 15 },
  botonEscanearTexto: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  camaraContainer: { flex: 1, borderRadius: 20, overflow: 'hidden' },
  camara: { flex: 1 },
  cancelarBoton: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#dc3545', padding: 12, borderRadius: 10 },
  cancelarTexto: { color: 'white', fontWeight: 'bold' },
  headerLectura: { marginBottom: 30, backgroundColor: '#fff', padding: 20, borderRadius: 15 },
  info: { fontSize: 16, color: '#6c757d' },
  listSection: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  studentRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  studentName: { fontSize: 16 },
  studentId: { fontSize: 14, color: '#888' },
  miFila: { backgroundColor: '#e8f4f8' },
  miTexto: { fontWeight: 'bold', color: '#007AFF' },
  boton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginBottom: 10 },
  botonVolver: { backgroundColor: '#6c757d' },
  botonTexto: { color: 'white', fontWeight: 'bold' },
  mensaje: { fontSize: 16, textAlign: 'center', color: '#495057', marginBottom: 20 },
  infoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  botonVolverInicio: { marginTop: 25 },
  botonVolverTexto: { color: '#6c757d' },
});

export default EstudianteView;