import { FC } from "react";
import { FlatList, SafeAreaView, TouchableHighlight, View, Text, Image, StyleSheet } from "react-native";
import { Forecast } from "../../types/forecast";
import { daysOfWeek } from "../units/helpers";


type Props = {
  weatherData: Forecast | null,
  setModalWindowDay: React.Dispatch<React.SetStateAction<string>>,
  setModalWindow: React.Dispatch<React.SetStateAction<boolean>>,
  findIconsrc: (id: number) => any,
  modalWindow: boolean,
};

export const DailyForecast: FC<Props> = ({weatherData, modalWindow, setModalWindow, setModalWindowDay, findIconsrc}) => {
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <FlatList
        style={styles.list}
        data={weatherData?.list.filter(item => item.dt_txt.split(' ')[1] === '15:00:00')}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item: hour }) => {
          const weather = hour.weather[0];
          const date = new Date(hour.dt_txt.split(' ')[0]);            

            return (
              <>
              {!modalWindow && (
                <TouchableHighlight
                  underlayColor='rgba(106, 90, 205, 0)'
                  onPress={() => {
                    setModalWindow(true);
                    setModalWindowDay(daysOfWeek[date.getDay()])
                  }}
                >
                  <View style={styles.listDailyComponent}>
                    <Text style={styles.title}>{daysOfWeek[date.getDay()]}</Text>

                    <Image
                      style={styles.dailyIcon}
                      source={findIconsrc(weather.id)}
                    />

                    <View>
                      <Text style={styles.title}>
                        {Math.round(hour.main.temp)}&#176;C
                      </Text>
                      <Text style={styles.title}>{weather.description}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
            </>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    textAlign: 'center',
  },
  list: {
    marginBottom: 20,
  },
  listDailyComponent: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
    backgroundColor: 'rgba(106, 90, 205, 0.5)',
    width: '100%',
    height: 125,
    borderRadius: 30, 
    paddingVertical:6,
    marginBottom: 5,
  },
  dailyIcon: {
    width: 80,
    height: 55,
  },
})