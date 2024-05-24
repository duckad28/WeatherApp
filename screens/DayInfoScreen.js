import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Modal,
    TouchableOpacity,
    StyleSheet,
    FlatList, Image
} from 'react-native';
import { colors, fontSizes, images } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCross, faMoon, faMultiply, faSun, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ExtraInfoItem } from '../components';
import { getWeatherIcon } from '../utilities';

const dayOfWeeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const getDayOfWeek = (day) => {
    let t = new Date(day);
    return dayOfWeeks[t.getDay()];
}


const getTimeDuration = (rise, set) => {
    let [timeRise, modifierRise] = rise.split(' ');
    let [hoursRise, minutesRise] = timeRise.split(':');
    let [timeSet, modifierSet] = set.split(' ');
    let [hoursSet, minutesSet] = timeSet.split(':');

    let riseTime = { hours: parseInt(hoursRise, 10), minutes: parseInt(minutesRise, 10) };
    let setTime = { hours: parseInt(hoursSet, 10), minutes: parseInt(minutesSet, 10) };
    if (modifierRise === modifierSet) {
        if (setTime.hours >= riseTime.hours) {
            let min = setTime.minutes - riseTime.minutes + 60;
            let hour = setTime.hours - riseTime.hours;
            if (min >= 60) {
                min = min - 60;
                hour = hour + 1;
            }
            return { hours: hour, minutes: min }
        } else {
            let min = setTime.minutes - riseTime.minutes + 60;
            let hour = setTime.hours + 24 - riseTime.hours;
            if (min >= 60) {
                min = min - 60;
                hour = hour + 1;
            }
            return { hours: hour, minutes: min }
        }
    }
    let min = setTime.minutes - riseTime.minutes + 60;
    let hour = setTime.hours + 12 - riseTime.hours;
    if (min >= 60) {
        min = min - 60;
        hour = hour + 1;
    }
    return { hours: hour, minutes: min }
}

const DayInfoScreen = (props) => {
    let weatherData = props.data;
    let { isVisible, setVisible } = props;
    let data = {
        date: '15/04/2024',
        dayOfWeeks: 'Monday',
        highestTemp: 30,
        lowestTemp: 24,
    }
    const dayInfoData = [
        {
            name: 'Rain probablity',
            value: Math.round(weatherData?.chance_of_rain) + "%"
        },
        {
            name: 'RealFeel',
            value: Math.round(weatherData?.feelslike_c) + "°"
        },
        {
            name: 'Humidity',
            value: weatherData?.humidity + "%"
        },
        {
            name: 'Cloud',
            value: weatherData?.cloud + "%"
        },
        {
            name: 'Wind speed',
            value: weatherData?.wind_kph + "kph"
        },
        {
            name: 'Wind degree',
            value: weatherData?.wind_degree
        },
        {
            name: 'Wind gust',
            value: weatherData?.gust_kph + "kph"
        },
        {
            name: 'UV',
            value: weatherData?.uv
        },
        {
            name: 'AQI',
            value: weatherData?.air_quality["us-epa-index"]
        }
    ]

    let highestTemp = Math.round(weatherData?.temp_c);
    let lowestTemp = Math.round(0);
    let sunrise = weatherData?.astro?.sunrise;
    let sunset = weatherData?.astro?.sunset;
    let moonrise = weatherData?.astro?.moonrise;
    let moonset = weatherData?.astro?.moonset;
    let sunDur = getTimeDuration(sunrise, sunset);
    let moonDur = getTimeDuration(moonrise, moonset);
    return (
        <Modal visible={isVisible} transparent={true} animationType='slide'>
            <View style={{
                flex: 1
            }}>
                <View style={{
                    height: 120
                }}>

                </View>


                <View style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    paddingHorizontal: 20
                }}>
                    <TouchableOpacity onPress={() => setVisible(false)} onS style={{ alignSelf: 'center', margin: 10 }}>
                        <View style={{
                            width: 60,
                            height: 10,
                            backgroundColor: colors.backgroundColor,
                            borderRadius: 5
                        }}>

                        </View>
                    </TouchableOpacity>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={headerStyle}>{getDayOfWeek(weatherData?.time)}</Text>
                        <Text style={normalTextStyle}>{weatherData?.time}</Text>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20
                    }}>
                        <Temperature temp={Math.round(weatherData?.temp_c)} condition={weatherData?.condition} fontSize={fontSizes.h1}></Temperature>
                        <Text>{weatherData?.condition?.text}</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <FlatList
                            data={dayInfoData}
                            renderItem={({ item }) => {
                                return <ExtraInfoItem data={item} height={40} nameStyle={nameTextStyle} valueStyle={valueTextStyle}></ExtraInfoItem>
                            }}
                            keyExtractor={item => item.name}></FlatList>

                        <View style={{
                            height: 120,
                            borderBottomWidth: 1,
                            borderColor: colors.fadeTextColor,
                            flexDirection: 'row',
                            alignItems: 'center',
                            margin: 10,
                            justifyContent: 'space-between'
                        }}>
                            <View style={{
                                flex: 1, padding: 10, borderWidth: 1,
                                borderColor: colors.fadeTextColor,
                            }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faSun} size={24}></FontAwesomeIcon>
                                    <View>
                                        <Text>{sunDur.hours} hrs</Text>
                                        <Text>{sunDur.minutes} mins</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>Rise</Text>
                                    <Text>{sunrise}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>Set</Text>
                                    <Text>{sunset}</Text>
                                </View>
                            </View>

                            <View style={{
                                flex: 1, padding: 10, borderWidth: 1,
                                borderColor: colors.fadeTextColor,
                            }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faMoon} size={24}></FontAwesomeIcon>
                                    <View>
                                        <Text>{moonDur.hours} hrs</Text>
                                        <Text>{moonDur.minutes} mins</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>Rise</Text>
                                    <Text>{moonrise}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>Set</Text>
                                    <Text>{moonset}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>

    )
}



const Temperature = (props) => {
    let { temp, condition } = props;
    return (
        <View style={{
            flexDirection: 'row',
        }}>
            <Image source={images[getWeatherIcon(condition?.icon)]} style={{ tintColor: '#000000', width: 60, height: 60, justifyContent: 'center', alignContent: 'center' }}></Image>
            <View style={{ width: 20 }}></View>
            <Text style={{ color: 'black', fontSize: 48 }}>{temp}°</Text>
        </View>
    )
}


const headerStyle = StyleSheet.create({
    fontSize: fontSizes.h4,
    color: 'black',
    fontWeight: '500'

})
const normalTextStyle = StyleSheet.create({
    fontSize: fontSizes.h6,
    color: colors.fadeBlackTextColor,
    fontWeight: '400',
    textAlignVertical: 'center',

})
const nameTextStyle = StyleSheet.create({
    fontSize: fontSizes.h5,
    color: colors.blackTextColor,
    fontWeight: '400',
    textAlignVertical: 'center',

})
const valueTextStyle = StyleSheet.create({
    fontSize: fontSizes.h6,
    color: colors.fadeBlackTextColor,
    fontWeight: '400',
    textAlignVertical: 'center',

})
const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})

export default DayInfoScreen;