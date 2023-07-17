import { FlatList, SafeAreaView, TouchableHighlight, View, Text, Image, StyleSheet  } from "react-native";
import { Forecast } from "../../types/forecast";
import { FC } from "react";
import { convertTo24HourFormat } from "../units/helpers";

type Props = {
  weatherData: Forecast | null,
  setModalWindowDay: React.Dispatch<React.SetStateAction<string>>,
  setModalWindow: React.Dispatch<React.SetStateAction<boolean>>,
  currentDate: string,
  findIconsrc: (id: number) => any,
};

export const HourlyForecast: FC<Props> = ({weatherData, setModalWindowDay, setModalWindow, currentDate, findIconsrc}) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <FlatList
      style={styles.list}
      horizontal
      data={weatherData?.list.slice(0, 8)}
      keyExtractor={(item, index) => index.toString()}
      renderItem={(hour) => {
        const weather = hour.item.weather[0]

        return (
          <TouchableHighlight
          underlayColor='rgba(106, 90, 205, 0)'
          onPress={() => {
            setModalWindow(true);
            setModalWindowDay(currentDate)
          }}
        >
          <View style={styles.listHourlyComponent}>
            <Text style={styles.title}>
              {convertTo24HourFormat(hour.item.dt_txt)}
            </Text>
            <Text style={styles.title}>
              {Math.round(hour.item.main.temp)}&#176;C
            </Text>
            <Image
            style={styles.smallIcon}
              source={findIconsrc(weather.id)}
            />
            <Text style={styles.title}>
              {weather.description}
            </Text>
          </View>
          </TouchableHighlight>
        )
      }}
    />
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  title: {
    color: 'white',
    textAlign: 'center',
  },
  smallIcon: {
    width: 25,
    height: 20,
    marginHorizontal: 'auto',
  },
  listHourlyComponent: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
    backgroundColor: 'rgba(106, 90, 205, 0.5)',
    width: 80,
    height: 125,
    borderRadius: 30, 
    paddingVertical:6,
    marginLeft: 5,
  },
  list: {
    marginBottom: 20,
  },
});