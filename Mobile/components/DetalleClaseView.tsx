import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, Alert, FlatList } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Clase } from '../models/clases';

interface DetalleClaseProps {
  clase: Clase;
  onBack: () => void;
  onDelete: (id: string) => void; // NUEVO: Prop para avisar que se borró
}

const DetalleClaseView = ({ clase, onBack, onDelete }: DetalleClaseProps) => {
  const [asistenciaAbierta, setAsistenciaAbierta] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [tokenActual, setTokenActual] = useState('');

  const generarContenidoQR = () => {
    if (!asistenciaAbierta) {
      Alert.alert("Aviso", "La asistencia está deshabilitada.");
      return;
    }
    const token = `CLASE-${clase.id}-FECHA-${new Date().toLocaleDateString()}`;
    setTokenActual(token);
    setModalVisible(true);
  };

  // NUEVO: Confirmación antes de borrar
  const confirmarEliminacion = () => {
    Alert.alert(
      "Eliminar Clase",
      `¿Estás seguro de que deseas eliminar la clase de ${clase.nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => onDelete(clase.id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Volver a mis clases</Text>
        </TouchableOpacity>
        
        {/* NUEVO: Botón de eliminar */}
        <TouchableOpacity onPress={confirmarEliminacion} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>

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
      </View>

      {/* NUEVO: Lista dinámica de asistentes */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>
          Estudiantes Presentes ({clase.asistentes?.length || 0})
        </Text>
        
        <FlatList
          data={clase.asistentes || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.studentRow}>
              <Text style={styles.studentName}>{item.nombre}</Text>
              <Text style={styles.studentId}>ID: {item.id}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Esperando registros...</Text>
          }
        />
      </View>

      <TouchableOpacity 
        style={[styles.fab, !asistenciaAbierta && { backgroundColor: '#ccc' }]} 
        onPress={generarContenidoQR}
        disabled={!asistenciaAbierta}
      >
        <Text style={styles.fabIcon}>QR</Text>
      </TouchableOpacity>

      {/*============================================================================
        Modal para mostrar el QR generado
      ==========================================*/}

      {/* Modal del QR (Sin cambios) */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escanea para registrarte</Text>
            <View style={styles.qrContainer}>
              {tokenActual ? <QRCode value={tokenActual} size={200} color="black" backgroundColor="white" /> : null}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20 },
  backButton: { paddingVertical: 5 },
  backText: { color: '#007AFF', fontSize: 16 },
  deleteButton: { paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#ffe5e5', borderRadius: 8 },
  deleteText: { color: '#dc3545', fontWeight: 'bold' },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#212529' },
  info: { fontSize: 16, color: '#6c757d' },
  controlCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3, marginBottom: 20 },
  controlText: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  open: { color: '#28a745', fontWeight: 'bold', fontSize: 18 },
  closed: { color: '#dc3545', fontWeight: 'bold', fontSize: 18 },
  listSection: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  emptyText: { textAlign: 'center', color: '#adb5bd', marginTop: 40 },
  studentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  studentName: { fontSize: 16, color: '#333' },
  studentId: { fontSize: 14, color: '#888' },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#212529', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  fabIcon: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#212529' },
  qrContainer: { padding: 10, backgroundColor: '#fff', borderRadius: 10, marginBottom: 20 },
  closeButton: { backgroundColor: '#dc3545', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default DetalleClaseView;