// Importer nødvendige hooks og biblioteker
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { DocumentTextIcon, HomeIcon, PlusSmallIcon } from "react-native-heroicons/solid";

// Konfiguration for Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDv5myi0-ZZPEGioDDlZNYSuSiiXwacMuI",
  authDomain: "opgave-12af1.firebaseapp.com",
  projectId: "opgave-12af1",
  storageBucket: "opgave-12af1.appspot.com",
  messagingSenderId: "552464189082",
  appId: "1:552464189082:web:5ab15faf362c2065720123",
  measurementId: "G-C980EBPG6T"
};

// Initialiser Firebase med den givne konfiguration
initializeApp(firebaseConfig);

// Importer komponenter fra forskellige filer
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import Startside from './components/Startside';
import FakturaOversigt from './components/FakturaOversigt';
import AddEventScreen from './components/AddEventScreen';
import FakturaEdit from './components/ProfileScreen/FakturaEdit';
import EventKontrol from './components/ProfileScreen/EventKontrol';


// Opret en Tab Navigator
const Tab = createBottomTabNavigator();


// Hovedkomponenten i appen
function App() {
  // State for at holde styr på den aktuelle bruger
  const [user, setUser] = useState(null); 
  const [role, setRole] = useState(null); 

  // Få adgang til Firebase Auth service
  const auth = getAuth();


    // Effekt for at lytte til ændringer i brugerens autentificeringstilstand
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        if (user) {
          // Hent brugerens rolle fra Firestore
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          }
        } else {
          setRole(null);
        }
      });

    // Afbryd lytteren, når komponenten afmonteres
    return () => unsubscribe();
  }, []);


  const renderScreensBasedOnRole = () => {
    const screens = [
      <Tab.Screen key="Startside" name="Startside" component={Startside} options={{ headerShown: false, tabBarIcon: HomeIcon }} />,
    ];

    if (role === 'lærer') {
      screens.push(
        <Tab.Screen key="AddEvent" name="Tilføj Event" component={AddEventScreen} options={{ headerShown: false, tabBarIcon: PlusSmallIcon}} />, 
        <Tab.Screen key="FakturaOversigt" name="FakturaOversigt" component={FakturaOversigt} options={{ headerShown: false, tabBarIcon: DocumentTextIcon }} />
      );
    } else if (role === 'kantine') {
      screens.push(
        <Tab.Screen key="EventKontrol" name="Event Kontrol" component={EventKontrol} options={{ headerShown: false }} />,
      );
    } else if (role === 'kantineEjer') {
      screens.push(
        <Tab.Screen key="FakturaEdit" name="FakturaEdit" component={FakturaEdit} options={{ headerShown: false, tabBarIcon: DocumentTextIcon }} />
      );
    }

    return screens;
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        {/* Render skærme baseret på brugerens rolle */}
        {user ? renderScreensBasedOnRole() : (
          <>
            <Tab.Screen name="SignUp" component={SignUpForm} options={{ headerShown: false }} />
            <Tab.Screen name="Login" component={LoginForm} options={{ headerShown: false }} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;

