import { FC } from "react"
import { TextInput, View, StyleSheet } from "react-native"

type Props = {
  setLocation: React.Dispatch<React.SetStateAction<string>>,
  location: string,
  fetchWeatherData: (cityName: string) => Promise<void>,
}

export const Search: FC<Props> = ({setLocation, location, fetchWeatherData}) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.search}
        placeholder="Enter location..."
        clearButtonMode='always'
        autoCapitalize='none'
        autoCorrect={false}
        value={location}
        onChangeText={(text) => setLocation(text)}
        onSubmitEditing={() => fetchWeatherData(location)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  search: {
    flex: 1,
    height: 40,
    width: 200,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    color: 'white',
    paddingLeft: 10,
  }, 
})