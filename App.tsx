import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { initDatabase } from './src/db/database';
import HomeScreen from './src/screens/HomeScreen';
import LogScreen from './src/screens/LogScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProgramsScreen from './src/screens/ProgramsScreen';

const Tab = createBottomTabNavigator();

const ACCENT = '#f0b429';
const INACTIVE = '#555';

function TabIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Log: '➕',
    Progress: '📈',
    Programs: '📋',
  };
  return <Text style={styles.icon}>{icons[name]}</Text>;
}

export default function App() {
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: () => <TabIcon name={route.name} />,
          tabBarActiveTintColor: ACCENT,
          tabBarInactiveTintColor: INACTIVE,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Sākums' }} />
        <Tab.Screen name="Log" component={LogScreen} options={{ title: 'Reģistrēt' }} />
        <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progress' }} />
        <Tab.Screen name="Programs" component={ProgramsScreen} options={{ title: 'Programmas' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
  },
  tabBar: {
    backgroundColor: '#13161e',
    borderTopColor: '#1f2330',
    borderTopWidth: 1,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
