import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, orderBy,onSnapshot } from 'firebase/firestore';

// Komponent til håndtering af fakturaer i appen
export default function FaktureEdit() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState('');

// Brug useEffect til at hente events når skærmen indlæses
  useEffect(() => {
    setLoading(true);
    const db = getFirestore();
    // Definerer en forespørgsel til at hente godkendte events, sorteret efter tidsstempel
    const eventsQuery = query(collection(db, 'events'), where('isApproved', '==', true), orderBy('timestamp', 'desc'));

    // Lytter til ændringer i eventsQuery og opdaterer state når data ændres
    const unsubscribe = onSnapshot(eventsQuery, (querySnapshot) => {
      const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(fetchedEvents);
      setLoading(false);
    });

    return unsubscribe; // Dette sørger for at afbryde lytningen, når komponenten afmonteres
  }, []);

  // Gemmer en ny faktura i databasen
  const saveInvoice = async (event) => {
    const db = getFirestore();
    const invoiceRef = doc(collection(db, "invoices"));

    // Definerer data for den nye faktura
    const newInvoice = {
      eventId: event.id,
      title: event.title,
      date: event.date,
      canteenRequest: event.canteenRequest,
      price: price,
      isPaid: false,
    };

    try {
      await setDoc(invoiceRef, newInvoice);
      Alert.alert('Success', 'Invoice saved successfully.');
      setPrice(''); // Reset the price input
    } catch (error) {
      console.error('Error saving invoice:', error);
      Alert.alert('Error', 'Failed to save invoice.');
    }
  };

  // Renderer hver event som en faktura
  const renderEvent = ({ item }) => (
    <View style={styles.eventContainer}>
      <Text style={styles.eventTitle}>Titel:  {item.title}</Text>
      <Text style={styles.eventText}>Dato: {item.date}</Text>
      <Text style={styles.eventText}>Tidspunkt: {item.time}</Text>
      <Text style={styles.eventText}>Lokation: {item.location}</Text>
      <Text style={styles.eventText}>Bestillings Oversigt: {item.canteenRequest}</Text>
      <Text style={styles.eventText}>Beskrivelse: {item.description}</Text>
      <TextInput
        style={styles.input}
        placeholder="Indtast pris"
        value={price}
        keyboardType="numeric"
        onChangeText={text => setPrice(text)}
      />
      <TouchableOpacity style={styles.saveButton} onPress={() => saveInvoice(item)}>
        <Text style={styles.saveButtonText}>Send Faktura</Text>
      </TouchableOpacity>
    </View>
  );
    // Håndtering af indlæsningstilstand og visning af fakturaer
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Faktura Edit</Text>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={renderEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80, 
    paddingHorizontal: 16, 
    backgroundColor: '#f9f9f9', 

  },
  eventContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8, 
    padding: 20, 
    marginBottom: 16, 
    elevation: 4, 
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
  },
  eventText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444', 
  },
  input: {
    backgroundColor: '#f2f2f2', 
    height: 44, 
    borderColor: '#dddddd',
    borderWidth: 1,
    borderRadius: 8, 
    marginBottom: 16, 
    paddingHorizontal: 10, 
    fontSize: 16, 
  },
  saveButton: {
    backgroundColor: '#4CAF50', 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    shadowColor: '#4CAF50', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 4, 
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600', 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'center',
  },
  eventTitle: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
});

