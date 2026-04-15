import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Clase } from '../models/clases';
import DetalleClaseView from './DetalleClaseView';
import { crearClase, eliminarClaseServer, listarClasesProfesor } from '../controllers/clasesController';

interface ProfesorViewProps {
  user: any; // Añadido para mostrar el nombre
  onLogout: () => void; // Añadido para cerrar sesión
}

const ProfesorView = ({ user, onLogout }: ProfesorViewProps) => {
  const [nombreClase, setNombreClase] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  
  const [amPmInicio, setAmPmInicio] = useState('AM');
  const [amPmFin, setAmPmFin] = useState('AM');
  
  const [claseSeleccionada, setClaseSeleccionada] = useState<Clase | null>(null);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [clases, setClases] = useState<Clase[]>([]);

  const cargarClases = async () => {
    const resultado = await listarClasesProfesor(String(user?.id));
    if (resultado?.exito) {
      const clasesMapeadas: Clase[] = (resultado.clases || []).map((c: any) => ({
        id: String(c.id),
        nombre: c.nombre,
        horaInicio: c.horaInicio || '--:--',
        horaFin: c.horaFin || '--:--',
        fecha: c.fecha || '',
        asistenciaAbierta: c.asistenciaAbierta ?? true,
        asistentes: [],
      }));
      setClases(clasesMapeadas);
    }
  };

  useEffect(() => {
    cargarClases();
  }, []);

  const construirDetalleClase = (clase: Clase) => {
    const tieneFecha = Boolean(clase.fecha?.trim());
    const tieneHorario = clase.horaInicio !== '--:--' && clase.horaFin !== '--:--';

    if (tieneFecha && tieneHorario) {
      return `${clase.fecha} | ${clase.horaInicio} - ${clase.horaFin}`;
    }

    if (tieneHorario) {
      return `${clase.horaInicio} - ${clase.horaFin}`;
    }

    if (tieneFecha) {
      return clase.fecha;
    }

    return 'Horario no registrado';
  };

  const formatearHora = (texto: string) => {
    const soloNumeros = texto.replace(/[^0-9]/g, '');
    if (soloNumeros.length > 2) {
      return `${soloNumeros.slice(0, 2)}:${soloNumeros.slice(2, 4)}`;
    }
    return soloNumeros;
  };

  const handleGuardar = async () => {
    if (!nombreClase || horaInicio.length < 5 || horaFin.length < 5) {
      Alert.alert("Error", "Completa el nombre y las horas en formato HH:MM.");
      return;
    }

    const resultado = await crearClase(
      nombreClase,
      String(user?.id),
      `${horaInicio} ${amPmInicio}`,
      `${horaFin} ${amPmFin}`,
      new Date().toLocaleDateString()
    );
    if (!resultado?.exito) {
      Alert.alert('Error', resultado?.mensaje || 'No se pudo crear la clase.');
      return;
    }

    Alert.alert("Éxito", "Asignatura añadida correctamente en la base de datos.");
    await cargarClases();
    
    setNombreClase(''); setHoraInicio(''); setHoraFin('');
    setAmPmInicio('AM'); setAmPmFin('AM');
    setMostrandoFormulario(false); 
  };

  if (claseSeleccionada) {
    return (
      <DetalleClaseView 
        clase={claseSeleccionada} 
        profesorId={String(user?.id)}
        onBack={async () => {
          await cargarClases();
          setClaseSeleccionada(null);
        }} 
        onDelete={async (id) => {
          const resultado = await eliminarClaseServer(id, String(user?.id));
          if (!resultado?.exito) {
            Alert.alert('Error', resultado?.mensaje || 'No se pudo eliminar la clase.');
            return;
          }
          await cargarClases();
          setClaseSeleccionada(null);
        }}
      />
    );
  }

  if (mostrandoFormulario) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setMostrandoFormulario(false)} style={styles.backButton}>
          <Text style={styles.backText}>← Cancelar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Configurar Clase</Text>
        
        <Text style={styles.label}>Nombre de la Asignatura:</Text>
        <TextInput style={styles.input} placeholder="Ej: Programación" value={nombreClase} onChangeText={setNombreClase} />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Inicio:</Text>
            <View style={styles.timeContainer}>
              <TextInput 
                style={[styles.input, styles.timeInput]} 
                placeholder="08:00" 
                value={horaInicio} 
                onChangeText={(text) => setHoraInicio(formatearHora(text))} 
                keyboardType="numeric"
                maxLength={5}
              />
              <TouchableOpacity style={styles.amPmButton} onPress={() => setAmPmInicio(amPmInicio === 'AM' ? 'PM' : 'AM')}>
                <Text style={styles.amPmText}>{amPmInicio}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Fin:</Text>
            <View style={styles.timeContainer}>
              <TextInput 
                style={[styles.input, styles.timeInput]} 
                placeholder="10:00" 
                value={horaFin} 
                onChangeText={(text) => setHoraFin(formatearHora(text))} 
                keyboardType="numeric"
                maxLength={5}
              />
              <TouchableOpacity style={styles.amPmButton} onPress={() => setAmPmFin(amPmFin === 'AM' ? 'PM' : 'AM')}>
                <Text style={styles.amPmText}>{amPmFin}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
          <Text style={styles.saveButtonText}>Guardar Asignatura</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ZONA DE PERFIL DEL PROFESOR */}
      <View style={styles.profileHeader}>
        <View>
          <Text style={styles.profileLabel}>Profesor:</Text>
          <Text style={styles.profileName}>{user?.nombre || 'Administrador'}</Text>
        </View>
        <TouchableOpacity style={styles.miniLogout} onPress={onLogout}>
           <Text style={styles.miniLogoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Mis Asignaturas</Text>

      <FlatList
        data={clases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.classCard} onPress={() => setClaseSeleccionada(item)}>
            <Text style={styles.classTitle}>{item.nombre}</Text>
            <Text style={styles.classDetails}>{construirDetalleClase(item)}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes clases creadas aún.</Text>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setMostrandoFormulario(true)}>
        <Text style={styles.addButtonText}>+ Añadir Asignatura</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  // NUEVOS ESTILOS PARA PERFIL Y LOGOUT
  profileHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginTop: 40, 
    marginBottom: 20,
    elevation: 2 
  },
  profileLabel: { fontSize: 12, color: '#6c757d' },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  miniLogout: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e74c3c' },
  miniLogoutText: { color: '#e74c3c', fontWeight: 'bold' },
  
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#212529' },
  classCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#4CAF50', elevation: 2 },
  classTitle: { fontSize: 18, fontWeight: 'bold' },
  classDetails: { color: '#666', marginTop: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#adb5bd' },
  addButton: { backgroundColor: '#212529', padding: 18, borderRadius: 12, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  saveButton: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
  label: { fontWeight: '600', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#dee2e6', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  row: { flexDirection: 'row' },
  timeContainer: { flexDirection: 'row', alignItems: 'center' },
  timeInput: { flex: 1, marginBottom: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0 },
  amPmButton: { backgroundColor: '#e9ecef', padding: 12, borderTopRightRadius: 8, borderBottomRightRadius: 8, borderWidth: 1, borderColor: '#dee2e6', justifyContent: 'center' },
  amPmText: { fontWeight: 'bold', color: '#495057' },
  backButton: { marginTop: 40, marginBottom: 20 },
  backText: { color: '#6c757d', fontSize: 16 },
});

export default ProfesorView;