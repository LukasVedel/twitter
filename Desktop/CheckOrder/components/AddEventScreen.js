import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Skærmen til at tilføje eller opdatere events
export default function AddEventScreen() {
  // State for eventdata og valgt billede
  const [event, setEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    canteenRequest: '',
    isApproved: false, 
    userId: '',
  });
  const [selectedImageURI, setSelectedImageURI] = useState(null);

// Tjekker om brugeren er logget ind ved mount og opdaterer userId i state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setEvent(prevState => ({
          ...prevState,
          userId: user.uid
        }));
      } else {
        // Brugeren er ikke logget ind, håndter dette tilfælde
        console.log("Bruger er ikke logget ind");
      }
    });
  
    return unsubscribe; // Afbryd abonnementet, når komponenten afmonteres
  }, []);
  
// Opdater event state når inputfelter ændres
  const handleInputChange = (field, value) => {
    setEvent(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  // Funktion til billedvalg fra telefonens bibliotek
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
        base64: true,
        maxWidth: 800,
        maxHeight: 600,
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        const base64String = result.assets[0].base64;
        setSelectedImageURI('data:image/png;base64,' + base64String);
      } else {
        console.log("Image not selected or base64 data not found.");
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick the image.');
    }
  };

  // Tilføj eller opdater event i databasen
  async function addOrUpdateEvent(event) {
    const db = getFirestore();
    const eventRef = doc(db, "events", event.id);
    const timestamp = Timestamp.now();

    const eventWithTimestampAndImage = {
      ...event,
      timestamp: timestamp,
      imageURI: selectedImageURI,
      isDeleted: false,
      isApproved: false
    };

    await setDoc(eventRef, eventWithTimestampAndImage, { merge: true });
  }

// Håndterer tryk på tilføj/opdater event
  const handleAddOrUpdateEvent = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const currentUserId = user ? user.uid : null;
  
    if (currentUserId && selectedImageURI) {
      try {
        const updatedEvent = { ...event, userId: currentUserId };
        await addOrUpdateEvent(updatedEvent);
        Alert.alert('Success', 'Event added/updated successfully.');
        resetForm();
      } catch (error) {
        console.error('Failed to add/update event:', error);
        Alert.alert('Error', 'Failed to add/update event.');
      }
    } else {
      Alert.alert('Error', 'Please provide all event details and select an image.');
    }
  };
  // Nulstil formens felter
  const resetForm = () => {
    setEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      canteenRequest: '',
      isApproved: false,
      userId: '',
    });
    setSelectedImageURI(null);
  };
  
  // UI til at indtaste eventinformation
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Tilføj Event</Text>
      <TextInput
        placeholder="Event ID"
        placeholderTextColor="#888"
        value={event.id}
        onChangeText={(text) => handleInputChange('id', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Event Titel"
        placeholderTextColor="#888"
        value={event.title}
        onChangeText={(text) => handleInputChange('title', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Dato (f.eks., 2023-01-01)"
        placeholderTextColor="#888"
        value={event.date}
        onChangeText={(text) => handleInputChange('date', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Tidspunkt (f.eks., 14:00)"
        placeholderTextColor="#888"
        value={event.time}
        onChangeText={(text) => handleInputChange('time', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Lokation"
        placeholderTextColor="#888"
        value={event.location}
        onChangeText={(text) => handleInputChange('location', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Kantineforspørgsel (f.eks., Kage, Drikkevarer)"
        placeholderTextColor="#888"
        value={event.canteenRequest}
        onChangeText={(text) => handleInputChange('canteenRequest', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Beskrivelse"
        placeholderTextColor="#888"
        multiline={true}
        numberOfLines={4} // Du kan justere antallet af linjer efter behov
        value={event.description}
        onChangeText={(text) => handleInputChange('description', text)}
        style={[styles.input, styles.textArea]} // Tilføj en ny style for tekstområdet
      />

      <View style={styles.imagePickerContainer}>
        {selectedImageURI ? (
          <Image source={{ uri: selectedImageURI }} style={styles.imagePreview} />
        ) : (
          <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
            <Ionicons name="camera" size={40} color="#666" />
            <Text style={styles.imagePlaceholderText}>Vælg et billede</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdateEvent}>
        <Text style={styles.buttonText}>Tilføj Event</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    borderColor: '#999',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePlaceholderText: {
    color: '#666',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  // ... Tilføj eventuelle yderligere styles ...
});