import { StyleSheet, Text, View } from 'react-native';

const today = new Date().toLocaleDateString('lv-LV', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GymLog</Text>
      <Text style={styles.date}>{today}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0f14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f0b429',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#aaa',
  },
});
