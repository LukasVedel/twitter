import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import styles from './ProfileScreen/styles';
// Komponent for visning af events
import EventList from './ProfileScreen/EventList';
import { Ionicons } from '@expo/vector-icons';

// Profilskærmen for brugerindstillinger
function ProfileScreen() {
  const auth = getAuth();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, [auth]);

  // Funktion til at logge brugeren ud
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Fejl ved logud: ", error);
    }
  };

  // Funktion til at slette brugerens konto
  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error("Fejl ved sletning af konto: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <EventList />
        <TouchableOpacity style={styles.menuIcon} onPress={() => setModalVisible(true)}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Modal til at vise brugerindstillinger */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalItem} onPress={handleSignOut}>
              <Text style={styles.modalItemText}>Log ud</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={handleDeleteAccount}>
              <Text style={[styles.modalItemText, styles.deleteText]}>Slet konto</Text>
            </TouchableOpacity>
            {userEmail && (
              <View style={styles.emailContainer}>
                <Text style={styles.emailText}>Brugerens e-mail: {userEmail}</Text>
              </View>
            )}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.closeButtonText}>Luk</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ProfileScreen;

