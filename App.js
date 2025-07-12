import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// A list of bodyweight strength exercises
const exercises = [
  "Do 10 push-ups",
  "Hold a 30-second plank",
  "Do 15 bodyweight squats",
  "Do 10 lunges per leg",
  "Do 10 tricep dips on a chair",
  "Do 30 jumping jacks",
  "Do a 1-minute wall sit",
  "Do 10 burpees",
  "Do 15 glute bridges",
  "Do 20 mountain climbers",
  "Do 10 Superman holds",
  "Hold a 20-second hollow body",
  "Do 12 calf raises per leg",
];

function getDailyExercise() {
  const today = new Date().toISOString().slice(0, 10); // e.g., "2025-07-12"
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % exercises.length;
  return exercises[index];
}

// Configure how notifications behave when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const exercise = getDailyExercise();

  useEffect(() => {
    const scheduleNotification = async () => {
      if (!Device.isDevice) return;

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          console.warn('Notifications not permitted');
          return;
        }
      }

      // Cancel any existing scheduled notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule one notification for 24 hours from now
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time for your next exercise",
          body: "Open the app to get your new daily exercise.",
        },
        trigger: {
          seconds: 86400, // 24 hours
        },
      });
    };

    scheduleNotification();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>One Daily Exercise</Text>
      <Text style={styles.exercise}>{exercise}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  exercise: {
    fontSize: 22,
    textAlign: 'center',
    color: '#333',
  },
});
