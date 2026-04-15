import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Clase } from '../models/clases';

interface ListaClasesProps {
  clases: Clase[];
  onSeleccionarClase: (clase: Clase) => void;
}

const ListaClases = ({ clases, onSeleccionarClase }: ListaClasesProps) => {
  return (
    <FlatList
      data={clases}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.classCard}
          onPress={() => onSeleccionarClase(item)}
        >
          <Text style={styles.classTitle}>{item.nombre}</Text>
          <Text style={styles.classDetails}>{item.fecha} | {item.horaInicio} - {item.horaFin}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No tienes clases creadas aún.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  classCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  classTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  classDetails: { color: '#666', marginTop: 5, fontSize: 14 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#adb5bd', fontSize: 16 },
});

export default ListaClases;