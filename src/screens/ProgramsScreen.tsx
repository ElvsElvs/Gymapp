import { StyleSheet, Text, View } from 'react-native';

export default function ProgramsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Programmas</Text>
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
  text: {
    fontSize: 22,
    color: '#f0f0f0',
  },
});
