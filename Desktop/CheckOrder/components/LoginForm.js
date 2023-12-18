import React, { useState } from 'react';
import { Button, Text, View, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView,Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/checkorder.webp';

function LoginForm() {
  // Opretter lokal state for formens felter og fejlmeddelelser
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  // Initialiserer Firebase Auth og Navigation
  const auth = getAuth();
  const navigation = useNavigation();

  // Funktion til at håndtere formens indsendelse
  const handleSubmit = async () => {
    // Forsøger at logge ind med indtastede email og password
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
      })

      .catch((error) => {
        // Viser fejlmeddelelse, hvis login mislykkes
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
      });
  };
// Funktion til at navigere til SignUp skærmen
  const navToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    // Rendrer formen og relaterede komponenter
    <ScrollView contentContainerStyle={styles.container}>
       <Image source={logo} style={styles.logo} />
      <Text style={styles.header}>Login</Text>
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
        secureTextEntry // Skjuler indtastet password
        style={styles.inputField}
      />
      {errorMessage && (
        <Text style={styles.error}>Error: {errorMessage}</Text> // Viser fejlmeddelelse, hvis der er en
      )}
      <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={navToSignUp}>
        <Text style={styles.signUpButtonText}>Sign up</Text>
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
  signUpButton: {
    marginTop: 20,
  },
  signUpButtonText: {
    color: 'darkgreen',
    fontSize: 16,
  },
  logo: {
    width: 150, // eller den bredde du ønsker
    height: 150, // eller den højde du ønsker
    resizeMode: 'contain', // Sikrer at logoet ikke strækkes
    marginBottom: 1, // Tilføjer afstand under logoet
    marginTop: -60,
  },
});

export default LoginForm;

