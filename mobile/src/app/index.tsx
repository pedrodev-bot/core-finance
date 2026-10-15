import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// Import the Axios instance we configured
import api from '../services/api'; 

export default function App() {
  // 1. STATE: Creates a variable to hold the API response and a function to update it.
  const [apiMessage, setApiMessage] = useState('Connecting to server...');

  // 2. EFFECT: Triggers the data fetching exactly once when the app screen loads.
  useEffect(() => {
    checkServerHealth();
  }, []); // The empty array [] means "run only once on mount"

  // 3. ASYNC FUNCTION: The actual HTTP call to the Python backend.
  const checkServerHealth = async () => {
    try {
      // Makes the GET request to http://YOUR_IP:8000/
      const response = await api.get('/');
      
      // Extracts the "message" field from the FastAPI JSON and updates the screen
      setApiMessage(response.data.message);
      
    } catch (error) {
      // If the backend is off or the IP is wrong, it falls here
      console.error("Connection failed:", error);
      setApiMessage('Failed to connect to the API. Check your IP and server.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 4. RENDER: The screen displays whatever is inside the state variable */}
      <Text style={styles.text}>{apiMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});