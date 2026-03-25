import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Clase } from '../models/clases';

interface DetalleClaseProps {
  clase: Clase;
  onBack: () => void;
}

const DetalleClaseView = ({ clase, onBack }: DetalleClaseProps) => {
  const [asistenciaAbierta, setAsistenciaAbierta] = useState(true);

  // Esta función genera el "secreto" que irá dentro del QR
  const generarContenidoQR = () => {
    if (!asistenciaAbierta) {
      Alert.alert("Aviso", "La asistencia está deshabilitada para esta clase.");
      return;
    }
    // El token incluye la fecha para que no sirva otro día
    const token = `CLASE-${clase.id}-FECHA-${new Date().toLocaleDateString()}`;
    Alert.alert("QR Generado", `Contenido dinámico: ${token}\n(Aquí se mostraría el código visual)`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Volver a mis clases</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{clase.nombre}</Text>
        <Text style={styles.info}>{clase.horaInicio} - {clase.horaFin}</Text>
      </View>

      <View style={styles.controlCard}>
        <Text style={styles.controlText}>Estatus de Asistencia:</Text>
        <View style={styles.row}>
          <Text style={asistenciaAbierta ? styles.open : styles.closed}>
            {asistenciaAbierta ? "ABIERTA" : "CERRADA"}
          </Text>
          <Switch 
            value={asistenciaAbierta} 
            onValueChange={setAsistenciaAbierta}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={asistenciaAbierta ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
        <Text style={styles.hint}>
          {asistenciaAbierta 
            ? "Los estudiantes pueden registrarse ahora." 
            : "Nadie puede registrarse, incluso con el QR."}
        </Text>
      </View>

      {/* Listado de asistencia (por ahora vacío) */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Estudiantes Presentes (0)</Text>
        <Text style={styles.emptyText}>Esperando registros...</Text>
      </View>

      {/* BOTÓN FLOTANTE PARA EL QR */}
      <TouchableOpacity 
        style={[styles.fab, !asistenciaAbierta && { backgroundColor: '#ccc' }]} 
        onPress={generarContenidoQR}
        disabled={!asistenciaAbierta}
      >
        <Text style={styles.fabIcon}>QR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  backButton: { marginTop: 40, marginBottom: 20 },
  backText: { color: '#007AFF', fontSize: 16 },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#212529' },
  info: { fontSize: 16, color: '#6c757d' },
  controlCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    elevation: 3,
    marginBottom: 20 
  },
  controlText: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  open: { color: '#28a745', fontWeight: 'bold', fontSize: 18 },
  closed: { color: '#dc3545', fontWeight: 'bold', fontSize: 18 },
  hint: { fontSize: 12, color: '#999', marginTop: 10 },
  listSection: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  emptyText: { textAlign: 'center', color: '#adb5bd', marginTop: 40 },
  // ESTILO DEL BOTÓN FLOTANTE
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#212529',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabIcon: { color: '#fff', fontWeight: 'bold', fontSize: 20 }
});

export default DetalleClaseView;