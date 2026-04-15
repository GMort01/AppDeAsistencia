import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, Alert, FlatList, Platform } from 'react-native';
import { Clase } from '../models/clases';
import { obtenerAsistentesClase, obtenerAsistentesClaseHoy } from '../controllers/asistenciaController';
import { actualizarEstadoClase } from '../controllers/clasesController';
import QRGeneradorDinamico from '../utils/qrGenerator';
import { exportarAsistentesDelDiaExcel } from '../utils/exportExcel';

interface DetalleClaseProps {
  clase: Clase;
  profesorId: string;
  onBack: () => void;
  onDelete: (id: string) => void; // NUEVO: Prop para avisar que se borró
}

const DetalleClaseView = ({ clase, profesorId, onBack, onDelete }: DetalleClaseProps) => {
  const [asistenciaAbierta, setAsistenciaAbierta] = useState(clase.asistenciaAbierta ?? true);
  const [modalVisible, setModalVisible] = useState(false);
  const [asistentesActuales, setAsistentesActuales] = useState(clase.asistentes || []);
  const detalleHorario =
    clase.horaInicio !== '--:--' && clase.horaFin !== '--:--'
      ? `${clase.horaInicio} - ${clase.horaFin}`
      : 'Horario no registrado';

  useEffect(() => {
    let activo = true;

    const cargarAsistentes = async () => {
      const resultado = await obtenerAsistentesClase(clase.id);
      if (activo && resultado?.exito) {
        setAsistentesActuales(resultado.asistentes || []);
      }
    };

    cargarAsistentes();
    const intervalo = setInterval(cargarAsistentes, 3000);

    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, [clase.id]);

  const cambiarEstadoAsistencia = async (nuevoEstado: boolean) => {
    const resultado = await actualizarEstadoClase(clase.id, profesorId, nuevoEstado);
    if (!resultado?.exito) {
      Alert.alert('Error', resultado?.mensaje || 'No se pudo actualizar el estado de la clase.');
      return;
    }

    setAsistenciaAbierta(nuevoEstado);
    if (!nuevoEstado) {
      setModalVisible(false);
    }
  };

  const abrirQR = () => {
    if (!asistenciaAbierta) {
      Alert.alert("Aviso", "La asistencia está deshabilitada.");
      return;
    }
    setModalVisible(true);
  };

  // NUEVO: Confirmación antes de borrar
  const confirmarEliminacion = () => {
    if (Platform.OS === 'web') {
      const confirmado = typeof window !== 'undefined'
        ? window.confirm(`¿Estás seguro de que deseas eliminar la clase de ${clase.nombre}?`)
        : true;
      if (confirmado) {
        onDelete(clase.id);
      }
      return;
    }

    Alert.alert(
      "Eliminar Clase",
      `¿Estás seguro de que deseas eliminar la clase de ${clase.nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => onDelete(clase.id) }
      ]
    );
  };

  const exportarExcelDelDia = async () => {
    const resultado = await obtenerAsistentesClaseHoy(clase.id);
    if (!resultado?.exito) {
      Alert.alert('Error', 'No se pudo obtener la lista de asistencia del día.');
      return;
    }

    try {
      exportarAsistentesDelDiaExcel(clase.nombre, resultado.asistentes || []);
      Alert.alert('Éxito', 'Se descargó el Excel de asistencia del día.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo exportar el archivo Excel en este dispositivo.');
    }
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

      <TouchableOpacity onPress={exportarExcelDelDia} style={styles.exportButton}>
        <Text style={styles.exportButtonText}>Descargar Excel del día</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{clase.nombre}</Text>
        <Text style={styles.info}>{detalleHorario}</Text>
      </View>

      <View style={styles.controlCard}>
        <Text style={styles.controlText}>Estatus de Asistencia:</Text>
        <View style={styles.row}>
          <Text style={asistenciaAbierta ? styles.open : styles.closed}>
            {asistenciaAbierta ? "ABIERTA" : "CERRADA"}
          </Text>
          <Switch 
            value={asistenciaAbierta} 
            onValueChange={cambiarEstadoAsistencia}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={asistenciaAbierta ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* NUEVO: Lista dinámica de asistentes */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>
          Estudiantes Presentes ({asistentesActuales?.length || 0})
        </Text>
        
        <FlatList
          data={asistentesActuales || []}
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
        onPress={abrirQR}
        disabled={!asistenciaAbierta}
      >
        <Text style={styles.fabIcon}>QR</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escanea para registrarte</Text>
            <View style={styles.qrContainer}>
              <QRGeneradorDinamico claseId={clase.id.toString()} />
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
  exportButton: { backgroundColor: '#198754', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, marginBottom: 15, alignSelf: 'flex-start' },
  exportButtonText: { color: '#fff', fontWeight: 'bold' },
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