import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, ImageBackground, StyleSheet, Image, ScrollView } from 'react-native';
import { colors, fontSizes, images, styles } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { WeatherInfoV, Temperature } from '../components';
import { faCloud, faCloudRain, faTint, faSun } from '@fortawesome/free-solid-svg-icons';
import { getDayOfWeek, getTimeOfDay, getWeatherIcon } from '../utilities';
import DayInfoScreen from './DayInfoScreen';

const WeatherInfoHorizontal = (props) => {
    let { temp_c, time, condition, daily_chance_of_rain } = props.weatherInfo;
    let timeOfDay = getTimeOfDay(time);
    let dayOfWeeks = getDayOfWeek(time);
    let rainPos = daily_chance_of_rain;
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={{ ...containerStyle, borderBottomColor: colors.borderColor, borderBottomWidth: 1, marginHorizontal: 5 }}>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                    <Image source={images[getWeatherIcon(condition?.icon)]} style={{ tintColor: '#ffffff', width: 20, height: 16, justifyContent: 'center' }}></Image>
                    <View style={{ width: 10 }}></View>
                    <Text style={{ ...textStyle, width: 50 }}>{timeOfDay}</Text>
                    <View style={{ width: 10 }}></View>
                    <Text style={textStyle}>{condition?.text}</Text>

                </View>

                <Text style={{ color: colors.textColor, fontSize: fontSizes.h6 }}>{Math.round(temp_c)}°</Text>
            </View>
        </TouchableOpacity>

    )
}
const UpcomingWeatherScreen = (props) => {
    const { navigation } = props;
    const { navigate } = navigation;
    const { route } = props;
    let weatherData = route.params.data;
    let imageBackground = route.params.background;
    // let hourlyData = weatherData.reduce((acc, ele) => acc.concat(ele?.hour), [])
    let [weatherInfo, setWeatherInfo] = useState({});
    let [isGraph, setGraph] = useState(true);
    let [isList, setList] = useState(false);
    let [isModalVisible, setModalVisble] = useState(false);

    let max = Math.max.apply(Math, weatherData.map(function (weather) {
        return weather?.day?.maxtemp_c;
    }))
    let min = Math.min.apply(Math, weatherData.map(function (weather) {
        return weather?.day?.mintemp_c;
    }))
    return (

        <ImageBackground source={imageBackground} style={{ flex: 1 }}>
            {isModalVisible && <DayInfoScreen isVisible={isModalVisible} setVisible={setModalVisble} data={weatherInfo}></DayInfoScreen>}
            <View style={{ flex: 1, padding: 10 }}>
                <TouchableOpacity onPress={() => navigate('MainScreen')} style={{ height: 40 }}>
                    <FontAwesomeIcon icon={faArrowLeft} size={26} color={colors.textColor}></FontAwesomeIcon>
                </TouchableOpacity>

                <View style={{ height: 60 }}>
                    <Text style={{ fontSize: 30, color: colors.textColor }}>Weather forecast</Text>
                </View>

                {/** ---------------- Button ----------------- */}
                <View style={{ height: 60, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <View style={wrapperStyle}>
                        <TouchableOpacity onPress={
                            () => {
                                return [
                                    setGraph(true),
                                    setList(false)
                                ]
                            }
                        }
                            style={{
                                backgroundColor: isGraph ? colors.buttonColor : null,
                                borderRadius: 10, height: 40, width: 60,
                                justifyContent: 'center', alignItems: 'center'
                            }}>

                            <Text style={{ ...textStyle, color: isGraph ? colors.textColor : colors.fadeBlackTextColor }}>DAYS</Text>
                        </TouchableOpacity>

                        <View style={{ width: 5 }}></View>

                        <TouchableOpacity onPress={
                            () => {
                                return [
                                    setGraph(false),
                                    setList(true)
                                ]
                            }
                        }
                            style={{
                                backgroundColor: isList ? colors.buttonColor : null,
                                borderRadius: 10, height: 40, width: 60,
                                justifyContent: 'center', alignItems: 'center'
                            }}>

                            <Text style={{ ...textStyle, color: isList ? colors.textColor : colors.fadeBlackTextColor }}>HOURS</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                {/** -------------------------- Info -------------------------- */}

                {/** ---------------- By Graph ----------------- */}
                {
                    isGraph && <View style={{ height: 400, flexDirection: 'row', marginTop: 20 }}>
                        <FlatList data={weatherData}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => {
                                return <WeatherInfoV weatherInfo={item} max={max} min={min}></WeatherInfoV>
                            }}
                            keyExtractor={item => item.date}>

                        </FlatList>

                    </View>
                }
                {/** ---------------- By List ----------------- */}
                {
                    isList && <ScrollView style={{ flexDirection: 'column' }} showsVerticalScrollIndicator={false}>
                        {weatherData.map((weather, index) => {
                            let day = new Date(weather?.date);
                            let options = { weekday: 'long' };
                            let dayName = day.toLocaleDateString('en-US', options)
                            return (

                                <FlatList key={index} data={weather?.hour}
                                    style={{}}
                                    showsVerticalScrollIndicator={false}
                                    ListHeaderComponent={
                                        <View style={{ paddingTop: 30, }}>
                                            <Text style={{ fontSize: fontSizes.h4, color: colors.textColor, textAlignVertical: 'center' }}>{dayName}</Text>
                                        </View>

                                    }
                                    ListFooterComponent={
                                        <View style={{ height: 20 }}></View>
                                    }
                                    renderItem={({ item }) => {
                                        return (

                                            <WeatherInfoHorizontal onPress={() => {
                                                setModalVisble(true)
                                                setWeatherInfo({ ...item, astro: weather?.astro })
                                            }} weatherInfo={item} astro={weather.astro}></WeatherInfoHorizontal>


                                        )

                                    }}
                                    keyExtractor={(item, index) => index}>

                                </FlatList>
                            )
                        }
                        )}
                    </ScrollView>
                }
                <View style={{ flex: 1 }}></View>
            </View>
        </ImageBackground>

    )
}



const high = 35;
const low = 20;

const wrapperStyle = StyleSheet.create({
    flexGrow: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
})

const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})
const containerStyle = StyleSheet.create({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: 40
})
export default UpcomingWeatherScreen;