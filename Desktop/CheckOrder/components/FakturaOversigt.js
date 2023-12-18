import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, getDocs, where, onSnapshot } from 'firebase/firestore';

function FakturaOversigt() {
  const [invoices, setInvoices] = useState([]); // State til at holde styr på fakturaer

  useEffect(() => {
    const db = getFirestore();
    // Opret en forespørgsel for at hente fakturaer
    const invoicesQuery = query(collection(db, 'invoices'), where('isPaid', '==', false));

    const unsubscribe = onSnapshot(invoicesQuery, (querySnapshot) => {
      const fetchedInvoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvoices(fetchedInvoices);
    });

    return unsubscribe; // Afbryd abonnementet, når komponenten afmonteres
  }, []);

  // Visuel del af komponenten
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Faktura Oversigt</Text>
      <FlatList
        data={invoices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.invoiceContainer}>
            <Text style={styles.invoicetitel}>Titel: {item.title}</Text>
            <Text style={styles.invoiceText}>Dato: {item.date}</Text>
            <Text style={styles.invoiceText}>Bestillings Oversigt: {item.canteenRequest}</Text>
            <Text style={styles.invoiceText}>Pris: {item.price} kr</Text>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentText}>Ved betaling benyt venligst følgende elektronisk betalingskode:</Text>
              <Text style={styles.paymentCode}>+71 0001234567891234-56789012</Text>
              <Text style={styles.paymentText}>Fakturanr. 120345 bedes angivet ved bankoverførsel</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f5f5',
    paddingTop: 80,

  },
  invoiceContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  invoiceText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
  paymentInfo: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fafafa', 
    borderWidth: 1,
    borderColor: '#eeeeee', 
  },
  paymentText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  paymentCode: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: "center",
  },
  invoicetitel: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default FakturaOversigt;


