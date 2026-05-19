import { View, Text, StyleSheet } from 'react-native';

function getTodayLabel(): string {
  return new Date().toLocaleDateString('lv-LV', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GymLog</Text>
      <Text style={styles.date}>{getTodayLabel()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    gap: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 15,
    color: '#6b7280',
  },
});
