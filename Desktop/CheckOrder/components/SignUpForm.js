import React, { useState } from 'react';
import { Button, Text, View, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView,Image } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import logo from '../assets/checkorder.webp';

function SignUpForm() {
  // Opretter lokal state for formens felter og fejlmeddelelser
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCompleted, setCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Initialiserer Firebase Auth og Navigation
  const auth = getAuth();
  const navigation = useNavigation();

  // Funktion til at håndtere formens indsendelse
  const handleSubmit = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Gem brugerrollen i Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        role: 'admin', 
        email: user.email 
      });

    } catch (error) {
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
    }
  };

// Funktion til at navigere til Login skærmen
  const navToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    // Rendrer formen og relaterede komponenter
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.header}>Sign up</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(email) => setEmail(email)}
        style={styles.inputField}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry
        style={styles.inputField}
      />
      {errorMessage && (
        <Text style={styles.error}>Error: {errorMessage}</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={navToLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 200, 
  },
  header: {
    fontSize: 40,
    marginBottom: 20,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  loginButton: {
    marginTop: 20,
  },
  loginButtonText: {
    color: 'darkgreen',
    fontSize: 16,
  },
  logo: {
    width: 150, 
    height: 150, 
    resizeMode: 'contain', 
    marginBottom: 1, 
    marginTop: -60,
  },
});

export default SignUpForm;

