import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Clase } from '../models/clases';
import { obtenerAsistentesClase, obtenerClasesRegistradasEstudiante, registrarAsistencia, registrarAsistenciaConToken } from '../controllers/asistenciaController';
import { obtenerDeviceId } from '../utils/deviceId';

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
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [clasesRegistradas, setClasesRegistradas] = useState<Clase[]>([]);

  useEffect(() => {
    obtenerDeviceId().then(setDeviceId).catch(() => {});
  }, []);

  useEffect(() => {
    const cargarClasesRegistradas = async () => {
      const resultado = await obtenerClasesRegistradasEstudiante(user.id.toString());
      if (resultado?.exito) {
        setClasesRegistradas(resultado.clases || []);
      }
    };

    cargarClasesRegistradas();
  }, [user.id]);

  useEffect(() => {
    if (!claseActual?.id) return;

    const refrescarAsistentes = async () => {
      const resultado = await obtenerAsistentesClase(claseActual.id);
      if (resultado?.exito) {
        setClaseActual((prev) => {
          if (!prev) return prev;
          return { ...prev, asistentes: resultado.asistentes || [] };
        });
      }
    };

    refrescarAsistentes();
    const intervalo = setInterval(refrescarAsistentes, 3000);
    return () => clearInterval(intervalo);
  }, [claseActual?.id]);

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

  const handleQRDetectado = async (resultado: { data: string }) => { // Agregamos async
    setEscaneando(false);
    const data = resultado.data;
    const nuevoEstudiante = { id: user.id.toString(), nombre: user.nombre };

    let resultadoRegistro: any;

    if (data.includes('.') && !data.includes('|')) {
      // Fase 1: token HMAC firmado (formato base64.hmac_hex)
      resultadoRegistro = await registrarAsistenciaConToken(data, nuevoEstudiante, deviceId);
    } else {
      // Legacy: formato claseId|timestamp
      const partes = data.split('|');
      if (partes.length !== 2) {
        Alert.alert('Error', 'QR no válido o formato no reconocido.');
        return;
      }
      const [claseId, timestampQR] = partes;
      resultadoRegistro = await registrarAsistencia(claseId, nuevoEstudiante, timestampQR, deviceId);
    }

    if (resultadoRegistro.exito) {
      Alert.alert("¡Éxito!", resultadoRegistro.mensaje);
      const claseRegistrada = {
        id: resultadoRegistro?.clase?.id || '',
        nombre: resultadoRegistro?.clase?.nombre || 'Clase',
        horaInicio: '--:--',
        horaFin: '--:--',
        fecha: new Date().toLocaleDateString(),
        asistentes: resultadoRegistro.asistentes || [nuevoEstudiante],
      };
      setClaseActual(claseRegistrada);

      const resultadoClases = await obtenerClasesRegistradasEstudiante(user.id.toString());
      if (resultadoClases?.exito) {
        setClasesRegistradas(resultadoClases.clases || []);
      } else {
        setClasesRegistradas((prev) => {
          if (prev.some((clase) => clase.id === claseRegistrada.id)) {
            return prev;
          }
          return [claseRegistrada, ...prev];
        });
      }
    } else {
      Alert.alert("Error", resultadoRegistro.mensaje);
    }
  };

  const abrirClaseRegistrada = async (clase: Clase) => {
    const resultado = await obtenerAsistentesClase(clase.id);
    if (!resultado?.exito) {
      Alert.alert('Error', 'No se pudo abrir la clase registrada.');
      return;
    }

    setClaseActual({
      ...clase,
      asistentes: resultado.asistentes || [],
    });
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
              <View style={[styles.studentRow, (item as any).userId?.toString() === user.id.toString() ? styles.miFila : null]}>
                <Text style={[styles.studentName, (item as any).userId?.toString() === user.id.toString() && styles.miTexto]}>
                  {item.nombre} {(item as any).userId?.toString() === user.id.toString() && "(Tú)"}
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
    <ScrollView style={styles.container} contentContainerStyle={styles.containerScroll}>
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
          <View style={styles.listaRegistradasContainer}>
            <Text style={styles.sectionTitle}>Mis clases registradas</Text>
            {clasesRegistradas.length === 0 ? (
              <Text style={styles.emptyText}>Todavía no has registrado asistencia en ninguna clase.</Text>
            ) : (
              <FlatList
                data={clasesRegistradas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.claseCard} onPress={() => abrirClaseRegistrada(item)}>
                    <Text style={styles.claseCardTitulo}>{item.nombre}</Text>
                    <Text style={styles.claseCardDetalle}>{item.fecha} | {item.horaInicio} - {item.horaFin}</Text>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            )}
          </View>
          <TouchableOpacity style={styles.botonVolverInicio} onPress={onBack}>
             <Text style={styles.botonVolverTexto}>Volver al Menú Principal</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  containerScroll: { paddingBottom: 40 },
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
  infoContainer: { width: '100%', alignItems: 'center', paddingTop: 12 },
  listaRegistradasContainer: { width: '100%', marginTop: 30, backgroundColor: '#fff', borderRadius: 15, padding: 16 },
  claseCard: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  claseCardTitulo: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginBottom: 4 },
  claseCardDetalle: { fontSize: 13, color: '#6c757d' },
  emptyText: { color: '#6c757d', textAlign: 'center', paddingVertical: 12 },
  botonVolverInicio: { marginTop: 25 },
  botonVolverTexto: { color: '#6c757d' },
});

export default EstudianteView;