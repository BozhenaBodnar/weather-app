import { StyleSheet, Alert, Text, SafeAreaView, ScrollView, RefreshControl, View, Image, ActivityIndicator, TouchableHighlight } from 'react-native';
import {HourlyForecast} from './HourlyForecast';
import sunnyRain from '../../assats/icons/sunnyRain.png';
import smallRain from '../../assats/icons/sunnyRain.png';
import heavyRain from '../../assats/icons/heavyRain.png';
import onlySnow from '../../assats/icons/onlySnow.png';
import Rain from '../../assats/icons/Rain.png';
import windRain from '../../assats/icons/windRain.png';
import whiteSnow from '../../assats/icons/whiteSnow.png';
import darkSnow from '../../assats/icons/darkSnow.png';
import smallWind from '../../assats/icons/smallWind.png';
import windy from '../../assats/icons/windy.png';
import sunny from '../../assats/icons/sunny.png';
import clearNight from '../../assats/icons/clearNight.png';
import nightWindy from '../../assats/icons/nightWindy.png';
import cloudy from '../../assats/icons/cloudy.png';
import nightCloudy from '../../assats/icons/nightCloudy.png';
import onlyClouds from '../../assats/icons/onlyClouds.png';
import nightClouds from '../../assats/icons/nightClouds.png';
import { FC, useEffect, useState } from 'react';
import { Forecast } from '../../types/forecast';
import { DailyForecast } from './DailyForecast';
import { DailyForecastSmall } from './DailyForecastSmall';
import { Search } from './Search';
import { openWeatherKey, daysOfWeek, convertTo24HourFormat } from '../units/helpers';

type Props = {
  setIsDay: React.Dispatch<React.SetStateAction<boolean>>,
  isDay: boolean,
}

export const Weather: FC<Props> = ({setIsDay, isDay}) => {
  const [weatherData, setWeatherData] = useState<Forecast | null>(null);
  const [location, setLocation] = useState('');
  const [isLoaaded, setIsLoaded] = useState(false);
  const [currentDate, setCurerntDate] = useState('');
  const [currentDateTime, setCurerntDateTime] = useState(new Date());
  const [modalWindow, setModalWindow] = useState(false);
  const [modalWindowDay, setModalWindowDay] = useState('');

  if (currentDateTime.toLocaleTimeString().split(' ')[1] === 'AM') {
    setIsDay(true);
  } else {
    setIsDay(false);
  }

  const iconMapping = {
    sunnyRain,
    smallRain,
    heavyRain,
    onlySnow,
    Rain,
    windRain,
    whiteSnow,
    darkSnow,
    smallWind,
    windy,
    sunny,
    clearNight,
    nightWindy,
    cloudy,
    nightCloudy,
    onlyClouds,
    nightClouds,
  };

  function findIcon(id: number = 802) {
    if (id === 500 || id === 501) {
      return 'sunnyRain'
    } else if (id === 502) {
      return 'smallRain'
    } else if (id === 503 || id === 504) {
      return 'heavyRain'
    } else if (id === 511 || id === 600 || id === 601) {
      return 'onlySnow'
    } else if (id === 520 || id === 521) {
      return 'Rain'
    } else if (id === 522 || id == 531) {
      return 'windRain'
    } else if (id > 601 && id <614 ) {
      return 'whiteSnow'
    } else if (id > 614 && id < 623) {
      return 'darkSnow'
    } else if (id === 701 || id === 711) {
      return 'smallWind'
    } else if (id > 770 && id < 782) {
      return 'windy'
    } else if (id === 800 && isDay) {
      return 'sunny'
    } else if (id === 800 && !isDay) {
      return 'clearNight'
    } else if (id === 801 && isDay) {
      return 'windy'
    } else if (id === 801 && !isDay) {
      return 'nightWindy'
    } else if (id === 802 && isDay) {
      return 'cloudy'
    } else if (id === 802 && !isDay) {
      return 'nightCloudy'
    } else if (id === 803 || id === 804 && isDay) {
      return 'onlyClouds'
    } else if (id === 803 || id === 804 && !isDay) {
      return 'nightClouds'
    }

    if (currentDateTime.toLocaleTimeString().split(' ')[1] === 'AM') {
      return 'cloudy';
    }

    return 'nightCloudy';
  }

  const findIconsrc = (id: number) => {
    return iconMapping[findIcon(id)]
  }

  useEffect(() => {
    const intevalId = setInterval(() => {
      const date = new Date();
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      setCurerntDate(dayName.split(',')[0]);
      setCurerntDateTime(new Date());
    }, 1000);

    return () => clearInterval(intevalId);
  }, [])

  const fetchWeatherData = async (cityName: string) => {
    setIsLoaded(true);
    
    try {
      setIsLoaded(false)
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${openWeatherKey}&units=metric`);

      if (response.status == 200) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        setWeatherData(null);
      }

    }catch {
      Alert.alert('Error', 'something went wrong')
    }
  };

  useEffect(() => {
    fetchWeatherData('Kyiv');
  }, [])

  if (isLoaaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={"#5500dc"}/>
      </View>
    )
  }

  const temperatures = (modalWindowDay === currentDate) 
    ? weatherData?.list.slice(32)
    : weatherData?.list.filter(
    day => daysOfWeek[new Date(day.dt_txt.split(' ')[0]).getDay()] === modalWindowDay
  );

  const actualeWeather = temperatures?.find(temp => temp.weather[0].main === 'Rain' || temp.weather[0].main === 'Clouds' || temp.weather[0].main === 'Clear');
  const maxTemp =Math.round(Math.max(...temperatures?.map(temperature => temperature.main.temp) ?? []));
  const minTemp = Math.round(Math.min(...temperatures?.map(temperature => temperature.main.temp) ?? []));
  const maxWind =Math.round(Math.max(...temperatures?.map(temperature => temperature.wind.speed) ?? []));
  const minWind = Math.round(Math.min(...temperatures?.map(temperature => temperature.wind.speed) ?? []));
  const minPressure =Math.round(Math.min(...temperatures?.map(temperature => temperature.main.pressure) ?? []));
  const averageHumidity = (temperatures && temperatures.length)
  ? Math.round(temperatures.reduce((acc, cur) => acc + cur.main.humidity, 0) / temperatures.length)
  : 0;
  const averagePressure = (temperatures && temperatures.length)
  ? Math.round(temperatures.reduce((acc, cur) => acc + cur.main.pressure, 0) / temperatures.length)
  : 0;


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={isLoaaded}
            onRefresh={() => fetchWeatherData(location)}/>
        }
      >
        <Search 
          setLocation={setLocation}
          location={location}
          fetchWeatherData={fetchWeatherData}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.citi}>
            {weatherData?.city.name}
          </Text>
          <Text style={styles.title}>
            {currentDate}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            style={styles.largeIcon}
            source={iconMapping[findIcon(weatherData?.list[0].weather[0].id)]}
          />

          <View style={styles.tempContainer}>
            <Text style={styles.titleTemp}>
              Max: {maxTemp}&#176;C
            </Text>
            <Text style={styles.titleTemp}>
              Min: {minTemp}&#176;C
            </Text>
          </View>

          <Text style={styles.description}>
            {weatherData?.list[0].weather[0].description}
          </Text>
        </View>


        <View style={styles.extraInfo}>
          <View style={styles.extraInfoBlock}>
            <Image
              style={styles.smallIcon}
              source={require(`../../assats/icons/humidyty.png`)}
            />
            <Text style={styles.title}>
              {Math.round(weatherData?.list[0].main.feels_like ?? 0)}&#176;C
            </Text>
            <Text style={styles.title}>
              Feels like
            </Text>
          </View>
          <View style={styles.extraInfoBlock}>
            <Image
              style={styles.smallIcon}
              source={require(`../../assats/icons/tempr.png`)}
            />
            <Text style={styles.title}>
              {weatherData?.list[0].main.humidity}%
            </Text>
            <Text style={styles.title}>
              Humidity
            </Text>
          </View>
          <View style={styles.extraInfoBlock}>
            <Image
              style={styles.smallIcon}
              source={require(`../../assats/icons/wind.png`)}
            />
            <Text style={styles.title}>
              {Math.round(weatherData?.list[0].wind.speed || 0)} km/h
            </Text>
            <Text style={styles.title}>
              Wind speed
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.subtitle}>Hourly Forecast</Text>
        </View>

        <HourlyForecast
         weatherData={weatherData}
         setModalWindow={setModalWindow}
         setModalWindowDay={setModalWindowDay}
         currentDate={currentDate}
         findIconsrc={findIconsrc}
        />

        <View>
          <Text style={styles.subtitle}>Next Forecast</Text>
        </View>

        <DailyForecast 
          weatherData={weatherData}
          setModalWindow={setModalWindow}
          setModalWindowDay={setModalWindowDay}
          findIconsrc={findIconsrc}
          modalWindow={modalWindow}
        />

      {modalWindow && (
        
        <View style={isDay ? styles.listComponentAM : styles.listComponentPM}>
          <TouchableHighlight
            underlayColor='rgba(106, 90, 205, 0)'
            onPress={() => {
              setModalWindow(false);
            }}
            >
          <Text style={styles.close}>X</Text>
          </TouchableHighlight>
          <Text style={styles.title2}>{modalWindowDay}</Text>

          <DailyForecastSmall
            weatherData={weatherData}
            setModalWindow={setModalWindow}
            setModalWindowDay={setModalWindowDay}
            findIconsrc={findIconsrc}
          />

         <View style={styles.topTempContainer}>
          <Text style={styles.topTempContainerText}>{maxTemp}&#176;C</Text>

          <Text style={styles.topTempContainerTextGrey}>{minTemp}&#176;C</Text>

          <Image
              style={styles.smallIcon}
              source={iconMapping[findIcon(weatherData?.list[0].weather[0].id)]}
              />
          </View>

          <View style={styles.diagramTimeContainer}>
            {temperatures?.map((temperature, index) => (
              <Text key={index} style={styles.diagramText}>
                {convertTo24HourFormat(temperature.dt_txt)}
              </Text>
            ))}
          </View>

          <View style={styles.diagram}>
            {temperatures?.map((temperature, index) => (
              <View
              key={index}
              style={[styles.bar, { height: temperature.main.temp * 4 }]}
              />
              ))}
          </View>

          <View style={styles.diagramTempContainer}>
            {temperatures?.map((temperature, index) => (
              <Text key={index} style={styles.diagramText}>
                {Math.round(temperature.main.temp)}&#176;C
              </Text>
            ))}
          </View>

          <Text style={styles.infoTitle}>Weather forecast for the day</Text>

          <View style={styles.infoBlock}>
            <Text style={styles.info}>
              It will be {actualeWeather?.weather[0].main} today. The lowest temperature will be {minTemp}&#176;C, and the highest {maxTemp}&#176;C. Average humidity - {averageHumidity}%%. The wind speed will be from {minWind} to {maxWind} km/h km. The average pressure will be {averagePressure} hPa , and the lowest {minPressure} hPa.
            </Text>
          </View>

        </View>
       )}
       </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },  
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 25,
    marginVertical: 40,
  },
  citi: {
    color: 'white',
    fontSize: 35,
  },
  title: {
    color: 'white',
    textAlign: 'center',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
  },
  largeIcon: {
    width: 160,
    height:120,
  },
  tempContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
  },
  titleTemp: {
    color: 'white',
    fontSize: 24,
    marginTop: 35,
  },
  description: {
    color: 'white',
    textTransform: 'capitalize',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 35,
  },  
  extraInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 15,
  },
  extraInfoBlock: {
    backgroundColor: 'rgba(106, 90, 205, 0.5)',
    width: 120,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    textAlign: 'center',
    paddingVertical:15,
    borderRadius: 30,    
  },
  subtitle: {
    fontSize: 24,
    marginVertical: 12,
    marginLeft: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  smallIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 'auto'
  },
  listComponentPM: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
    backgroundColor: 'rgb(20, 0, 129)',
    width: '100%',
    height: 800,
    borderRadius: 30, 
    paddingVertical:6,
  },
  listComponentAM: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
    backgroundColor: 'rgb(225, 145, 225)',
    width: '100%',
    height: 800,
    borderRadius: 30, 
    paddingVertical:6,
  },
  close: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  title2: {
    fontSize: 30,
    color: 'white',
    marginTop: 10,
    marginBottom: 25,
  },
  infoTitle: {
    fontSize: 30,
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
  },
  topTempContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: 270,
    gap: 10,
    marginBottom: 10,
  },
  topTempContainerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  topTempContainerTextGrey: {
    color: 'rgb(180, 180, 180)',
    fontWeight: 'bold',
    fontSize: 18,
  },
  diagram: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 200,
    width: 400,
    backgroundColor: 'rgba(106, 90, 205, 0.5)',
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  bar: {
    width: 5,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  diagramTempContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 25,
  },
  diagramTimeContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 21,
  },
  diagramText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
  },
  info: {
    color: 'white',
    textAlign: 'justify',
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    height: 120,
    width: 400,
    borderRadius: 20,
    backgroundColor: 'rgba(106, 90, 205, 0.5)',
    margin: 10,
  }
})
