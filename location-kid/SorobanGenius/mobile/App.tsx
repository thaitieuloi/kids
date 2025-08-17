import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import GameScreen from './src/screens/GameScreen';
import ResultsScreen from './src/screens/ResultsScreen';

// Types
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Game: { settings: GameSettings };
  Results: { session: GameSession };
};

export interface GameSettings {
  questionCount: number;
  rowCount: number;
  timeLimit: number;
  numberRange: number;
  feedbackSound: boolean;
  numberReading: boolean;
  transitionSound: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface MathProblem {
  id: string;
  number1: number;
  number2: number;
  operator: '+' | '-';
  correctAnswer: number;
  difficulty: string;
}

export interface GameAnswer {
  problemId: string;
  userAnswer: number | null;
  timeSpent: number;
  isCorrect: boolean;
  skipped: boolean;
}

export interface GameSession {
  id: string;
  settings: GameSettings;
  problems: MathProblem[];
  answers: GameAnswer[];
  startTime: Date;
  endTime?: Date;
  score: number;
  totalTime: number;
}

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4F46E5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Soroban Math' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Cài đặt' }}
          />
          <Stack.Screen 
            name="Game" 
            component={GameScreen}
            options={{ title: 'Chơi game', headerLeft: () => null }}
          />
          <Stack.Screen 
            name="Results" 
            component={ResultsScreen}
            options={{ title: 'Kết quả', headerLeft: () => null }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}