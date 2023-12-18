import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, orderBy, getDocs,where } from 'firebase/firestore';
//import styles from './styles';
import { useIsFocused } from '@react-navigation/native';

// Logoet for appen
const appLogo = require('../../assets/check-order.png');


export default function EventList() {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const isFocused = useIsFocused();

  // Henter events fra Firebase når skærmen er i fokus
  useEffect(() => {
    const fetchEvents = async () => {
      const db = getFirestore();
      // Forespørgsel for at hente godkendte events, sorteret efter dato
      const eventsQuery = query(collection(db, "events"), where('isApproved', '==', true), orderBy("date", "asc"));
      const querySnapshot = await getDocs(eventsQuery);
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filtre kun fremtidige events
      const todayDateOnly = new Date();
      todayDateOnly.setHours(0, 0, 0, 0);  

      // Filtrer og behold kun fremtidige events
      const upcomingEvents = eventsList.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);  
        return eventDate >= todayDateOnly;
      });

      setEvents(upcomingEvents);
    };

    if (isFocused) {
      fetchEvents();
    }
  }, [isFocused]);

  // Håndterer tryk på et event og åbner en modal med detaljer
  const handlePress = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  // Brugergrænseflade for at vise listen af events
  return (
    <View style={{ flex: 1 }}>
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <Image source={appLogo} style={styles.logo} />
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handlePress(item)}>
          <View style={styles.card}>
            <Image
              style={styles.cardImage}
              source={{ uri: item.imageURI }}  
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDetail}>{item.date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
                <Text style={styles.modalDescription}>{selectedEvent?.description}</Text>
              </View>
              <TouchableOpacity
                style={styles.buttonClose}
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
  header: {
    alignItems: 'center',
    marginBottom: -10, 
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginTop: -30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginHorizontal: 16,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDetail: {
    fontSize: 14,
    color: '#666',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    minWidth: 300,  
    minHeight: 200, 
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2, 
    borderColor: '#ddd', 
  },
  modalContent: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
