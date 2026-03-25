import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { guardarClase, Clase, listaClases } from '../models/clases';
import DetalleClaseView from './DetalleClaseView';

interface ProfesorViewProps {
  onBack: () => void;
}

const ProfesorView = ({ onBack }: ProfesorViewProps) => {
  // Estados
  const [nombreClase, setNombreClase] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  
  // Control de navegación interna
  const [claseSeleccionada, setClaseSeleccionada] = useState<Clase | null>(null);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  const handleGuardar = () => {
    if (!nombreClase || !horaInicio || !horaFin) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const nuevaClase: Clase = {
      id: Date.now().toString(),
      nombre: nombreClase,
      horaInicio,
      horaFin,
      fecha: new Date().toLocaleDateString(),
    };

    guardarClase(nuevaClase);
    Alert.alert("Éxito", "Asignatura añadida correctamente.");
    
    // Resetear formulario y volver a la lista
    setNombreClase(''); setHoraInicio(''); setHoraFin('');
    setMostrandoFormulario(false); 
  };

  // --- LÓGICA DE RENDERIZADO (LA ESCALERA) ---

  // 1. Si hay una clase seleccionada, mostramos el detalle (Botón flotante, QR, etc.)
  if (claseSeleccionada) {
    return (
      <DetalleClaseView 
        clase={claseSeleccionada} 
        onBack={() => setClaseSeleccionada(null)} 
      />
    );
  }

  // 2. Si pulsamos el botón "+", mostramos el formulario de creación
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
            <TextInput style={styles.input} placeholder="08:00" value={horaInicio} onChangeText={setHoraInicio} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Fin:</Text>
            <TextInput style={styles.input} placeholder="10:00" value={horaFin} onChangeText={setHoraFin} />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
          <Text style={styles.saveButtonText}>Guardar Asignatura</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Por defecto, mostramos la lista de todas las asignaturas
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Salir al Inicio</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Mis Asignaturas</Text>

      <FlatList
        data={listaClases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.classCard}
            onPress={() => setClaseSeleccionada(item)} // Al tocar, entra al detalle
          >
            <Text style={styles.classTitle}>{item.nombre}</Text>
            <Text style={styles.classDetails}>{item.fecha} | {item.horaInicio} - {item.horaFin}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes clases creadas aún.</Text>
        }
      />

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setMostrandoFormulario(true)}
      >
        <Text style={styles.addButtonText}>+ Añadir Asignatura</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  backButton: { marginTop: 40, marginBottom: 20 },
  backText: { color: '#6c757d', fontSize: 16 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#212529' },
  classCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
    elevation: 2
  },
  classTitle: { fontSize: 18, fontWeight: 'bold' },
  classDetails: { color: '#666', marginTop: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#adb5bd' },
  addButton: { backgroundColor: '#212529', padding: 18, borderRadius: 12, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  saveButton: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
  label: { fontWeight: '600', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#dee2e6', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  row: { flexDirection: 'row' }
});

export default ProfesorView;