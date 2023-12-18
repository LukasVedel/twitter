import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import { getFirestore, collection, query, getDocs, where, doc, setDoc,onSnapshot } from "firebase/firestore";

// Hovedkomponent for Eventkontrol
export default function EventKontrol() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Brug useEffect til at lytte på ændringer i event-collection
  useEffect(() => {
    const db = getFirestore();
    // Opret en forespørgsel for at hente events, der ikke er slettet
    const eventsQuery = query(collection(db, "events"), where('isDeleted', '==', false));

    // Lytter til ændringer i events og opdaterer state
    const unsubscribe = onSnapshot(eventsQuery, (querySnapshot) => {
      const fetchedEvents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(fetchedEvents);
    });

    return unsubscribe; // Dette sørger for at afbryde lytningen, når komponenten afmonteres
  }, []);

  // Håndterer godkendelse af events
  const approveEvent = async (eventId) => {
    const db = getFirestore();
    const eventRef = doc(db, "events", eventId);
  
    // Forsøger at opdatere event med godkendelsesstatus
    try {
      await setDoc(eventRef, { isApproved: true }, { merge: true });
      Alert.alert('Event Approved', 'The event has been successfully approved.');
    } catch (error) {
      console.error('Error approving event:', error);
      Alert.alert('Error', 'Failed to approve event.');
    }
  };
  
  
// Renderer hvert event som et element i listen
  const renderEvent = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.eventContainer}
        onPress={() => {
          setSelectedEvent(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.eventTitle}>Titel: {item.title}</Text>
        <Text style={styles.eventText}>Dato: {item.date}</Text>
        <Text style={styles.eventText}>Tidspunkt: {item.time}</Text>
        <Text style={styles.eventText}>Lokation: {item.location}</Text>
        <Text style={styles.eventText}>Beskrivelse: {item.description}</Text>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => approveEvent(item.id)}
        >
          <Text style={styles.approveButtonText}>Event Godkendelse</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Event Kontrol</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Bestillings Oversigt</Text>
            {selectedEvent && <Text style={styles.modalText}>{selectedEvent.canteenRequest}</Text>}
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Luk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  eventTitle: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    minWidth: 300,
    minHeight: 200,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    marginTop: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  eventText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444', 
  },
});

