import React, { useEffect, useRef } from 'react';
import { AppState, StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';
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
  "Do 12 shoulder tap push-ups",
  "Do 15 incline push-ups",
  "Do 10 diamond push-ups",
  "Do 10 wide push-ups",
  "Do 15 pike push-ups",
  "Do 15 wall push-ups",
  "Do 10 slow eccentric push-ups",
  "Do 10 hand-release push-ups",
  "Do 12 reverse lunges per leg",
  "Do 12 lateral lunges per leg",
  "Do 12 step-ups per leg",
  "Do 12 single-leg glute bridges per leg",
  "Do 12 Bulgarian split squats per leg",
  "Do 15 squat pulses",
  "Do 12 wall-sit leg lifts",
  "Do 30 Russian twists",
  "Do 15 leg raises",
  "Do 15 bicycle crunches per side",
  "Do 30-second side plank per side",
  "Do 15 heel taps per side",
  "Do 12 squat to calf raises",
  "Do 10 push-up to downward dog transitions",
  "Do 10 squat jumps",
  "Do 10 walkouts",
  "Do 12 chair sit-stands",
  "Do 10 bear crawls forward and back",
  "Hold a 20-second isometric squat",
  "Do 12 dead bugs",
  "Hold a 30-second single-leg stand per leg",
  "Hold a 20-second lunge position per leg",
  "Do 10 slow bird-dog reps per side",
  "Do 12 wall shoulder blade squeezes",
  "Do 10 wall angels",
  "Hold a 30-second chair pose",
  "Do 10 cross-body toe touches",
  "Do 12 super slow squats",
  "Hold a 30-second tabletop bridge",
  "Do 15 standing knee lifts per leg",
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

      // Check for existing scheduled notifications
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      if (scheduled.length === 0) {
        // Only schedule if none exist
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Time for your next exercise",
            body: "Open the app to get your new daily exercise.",
          },
          trigger: {
            seconds: 72000, // 20 hours
          },
        });
      }
    };

    scheduleNotification();

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      Notifications.dismissNotificationAsync(response.notification.request.identifier);
    });

    return () => {
      responseListener.remove();
    };
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
