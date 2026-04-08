import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
// 1. Importación corregida (solo una vez y con eliminarClase)
import { guardarClase, Clase, listaClases, eliminarClase } from '../models/clases';
// 2. Importación recuperada
import DetalleClaseView from './DetalleClaseView';

interface ProfesorViewProps {
  onBack: () => void;
}

const ProfesorView = ({ onBack }: ProfesorViewProps) => {
  const [nombreClase, setNombreClase] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  
  const [amPmInicio, setAmPmInicio] = useState('AM');
  const [amPmFin, setAmPmFin] = useState('AM');
  
  const [claseSeleccionada, setClaseSeleccionada] = useState<Clase | null>(null);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  const formatearHora = (texto: string) => {
    const soloNumeros = texto.replace(/[^0-9]/g, '');
    if (soloNumeros.length > 2) {
      return `${soloNumeros.slice(0, 2)}:${soloNumeros.slice(2, 4)}`;
    }
    return soloNumeros;
  };

  const handleGuardar = () => {
    if (!nombreClase || horaInicio.length < 5 || horaFin.length < 5) {
      Alert.alert("Error", "Completa el nombre y las horas en formato HH:MM.");
      return;
    }

    const nuevaClase: Clase = {
      id: Date.now().toString(),
      nombre: nombreClase,
      horaInicio: `${horaInicio} ${amPmInicio}`,
      horaFin: `${horaFin} ${amPmFin}`,
      fecha: new Date().toLocaleDateString(),
      asistentes: [], // 3. Arreglo vacío de asistentes añadido
    };

    guardarClase(nuevaClase);
    Alert.alert("Éxito", "Asignatura añadida correctamente.");
    
    setNombreClase(''); setHoraInicio(''); setHoraFin('');
    setAmPmInicio('AM'); setAmPmFin('AM');
    setMostrandoFormulario(false); 
  };

  if (claseSeleccionada) {
    return (
      <DetalleClaseView 
        clase={claseSeleccionada} 
        onBack={() => setClaseSeleccionada(null)} 
        onDelete={(id) => {
          eliminarClase(id);
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
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Salir al Inicio</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Mis Asignaturas</Text>

      <FlatList
        data={listaClases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.classCard} onPress={() => setClaseSeleccionada(item)}>
            <Text style={styles.classTitle}>{item.nombre}</Text>
            <Text style={styles.classDetails}>{item.fecha} | {item.horaInicio} - {item.horaFin}</Text>
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
  backButton: { marginTop: 40, marginBottom: 20 },
  backText: { color: '#6c757d', fontSize: 16 },
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
  amPmText: { fontWeight: 'bold', color: '#495057' }
});

export default ProfesorView;