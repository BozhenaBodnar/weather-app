import { StyleSheet, View, ImageBackground } from 'react-native';
import { useState } from 'react';
import { Weather } from './assets/src/Weather';

export default function App() {
  const [isDay, setIsDay] = useState(false);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={isDay
        ? require('./assats/AP.avif')
        : require('./assats/PM.jpg')}
        style={styles.backgroundImage}
      >
        <Weather
          setIsDay={setIsDay}
          isDay={isDay}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

