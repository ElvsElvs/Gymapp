import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from './src/db/database';

const today = new Date().toLocaleDateString('lv-LV', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function App() {
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GymLog</Text>
      <Text style={styles.date}>{today}</Text>
      <StatusBar style="auto" />
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
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
});
