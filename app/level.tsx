import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Camera } from 'expo-camera';

const { width, height } = Dimensions.get('window');

export default function LevelScreen() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const subscription = Accelerometer.addListener(setData);

    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    return () => subscription && subscription.remove();
  }, []);

  const { x } = data;
  const tiltX = Math.round(x * 90);
  const centerDotLeft = width / 2 + tiltX * 5;

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No camera access</Text>;

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.back}>
        <View style={styles.horizontalLine} />
        <View style={[styles.dot, { left: centerDotLeft }]} />
        <View style={styles.verticalRuler}>
          {Array.from({ length: 10 }).map((_, i) => (
            <View
              key={i}
              style={[styles.rulerMark, { top: (height / 10) * i }]}
            />
          ))}
        </View>
      </Camera>
      <Text style={styles.infoText}>Nghiêng: {tiltX}°</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  horizontalLine: {
    position: 'absolute',
    top: height / 2,
    width: '100%',
    height: 2,
    backgroundColor: 'lime',
  },
  dot: {
    position: 'absolute',
    top: height / 2 - 10,
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  verticalRuler: {
    position: 'absolute',
    left: width / 2,
    top: 0,
    width: 2,
    height: '100%',
    backgroundColor: 'white',
  },
  rulerMark: {
    position: 'absolute',
    left: -10,
    width: 20,
    height: 1,
    backgroundColor: 'white',
  },
  infoText: {
    position: 'absolute',
    top: 40,
    left: 20,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
