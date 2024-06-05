import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, ImageBackground, StyleSheet, Image, ScrollView } from 'react-native';
import { colors, fontSizes, images, styles } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { WeatherInfoV, Temperature } from '../components';
import { getDayOfWeek, getTimeOfDay, getWeatherIcon, cToF } from '../utilities';
import DayInfoScreen from './DayInfoScreen';

const en = ['Weather Forecast', 'DAYS', 'HOURS'];
const vn = ['Dự báo thời tiết', 'Theo ngày', 'Theo giờ'];
const dayOfWeeksVn = {
    'Monday' : 'Thứ hai',
    'Tuesday' : 'Thứ ba',
    'Wednesday' : 'Thứ tư',
    'Thursday' : 'Thứ năm',
    'Friday' : 'Thứ sáu',
    'Saturday' : 'Thứ bảy',
    'Sunday' : 'Chủ nhật',
    'Today' : 'Hôm nay'
}

const WeatherInfoHorizontal = (props) => {
    let { temp_c, time, condition, daily_chance_of_rain } = props.weatherInfo;
    let {unit} = props;
    let timeOfDay = getTimeOfDay(time);
    let dayOfWeeks = getDayOfWeek(time);
    let rainPos = daily_chance_of_rain;
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={{ ...containerStyle,
                borderRadius: 10, marginHorizontal: 5, paddingHorizontal: 5, backgroundColor: colors.buttonColor }}>
                <View 
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center'
                        }}
                >
                    <Image source={images[getWeatherIcon(condition?.icon)]}
                        style={{ tintColor: '#ffffff', width: 20, height: 16, justifyContent: 'center' }}
                    ></Image>
                    <View style={{ width: 10 }}></View>
                    <Text style={{ ...textStyle, width: 50 }}>{timeOfDay}</Text>
                    <View style={{ width: 10 }}></View>
                    <Text style={textStyle}>{condition?.text}</Text>
                </View>
                <Text 
                    style={{
                        color: colors.textColor,
                        fontSize: fontSizes.h6
                    }}
                >
                    {unit ? Math.round(temp_c) : cToF(temp_c)}°
                </Text>
            </View>
        </TouchableOpacity>

    )
}
const UpcomingWeatherScreen = (props) => {
    const { navigation } = props;
    const { navigate } = navigation;
    const { route } = props;

    let [lan, setLan] = useState(route?.params?.lan ? en : vn);

    let weatherData = route.params.data;
    let imageBackground = route.params.background;
    let day = route.params.day;
    let unit = route.params.unit;

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
            {isModalVisible && <DayInfoScreen isVisible={true} setVisible={setModalVisble} data={weatherInfo} unit={unit}></DayInfoScreen>}
            <View style={{ flex: 1, padding: 10 }}>
                <TouchableOpacity 
                    onPress={() => navigate('MainScreen')}
                    style={{ height: 40 }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} size={26} color={colors.textColor}></FontAwesomeIcon>
                </TouchableOpacity>

                <View style={{ height: 60 }}>
                    <Text style={{ fontSize: 30, color: colors.textColor }}>{lan[0]}</Text>
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

                            <Text
                                style={{
                                    ...textStyle, 
                                    color: isGraph ? colors.textColor : colors.fadeBlackTextColor,
                                    textAlign: 'center'
                                    }}
                                >
                                    {lan[1]}
                                </Text>
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

                            <Text style={{
                                ...textStyle,
                                color: isList ? colors.textColor : colors.fadeBlackTextColor,
                                textAlign: 'center'
                                }}
                            >
                                {lan[2]}
                            </Text>
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
                            renderItem={({ item , index}) => {
                                return <WeatherInfoV
                                            unit={unit}
                                            weatherInfo={item}
                                            max={max}
                                            min={min}
                                            today={day==index}
                                        ></WeatherInfoV>
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
                                <View key = {index} style={{ borderWidth: 1, marginBottom: 40, paddingHorizontal: 5, borderColor: 'white'}}>
                                    <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: fontSizes.h4, color: colors.textColor, textAlignVertical: 'center' }}>{route?.params?.lan ? dayName : dayOfWeeksVn[dayName]}</Text>
                                            <Text style={{ fontSize: fontSizes.h4, color: colors.textColor, textAlignVertical: 'center' }}>{weather?.date}</Text>
                                    </View>
                                    <FlatList key={index} data={weather?.hour}
                                    style={{height: 300}}
                                    nestedScrollEnabled
                                    showsVerticalScrollIndicator={true}

                                    ListFooterComponent={
                                        <View style={{ height: 20 }}></View>
                                    }
                                    renderItem={({ item }) => {
                                        return (
                                            <WeatherInfoHorizontal
                                                onPress={() => {
                                                    setModalVisble(true)
                                                    setWeatherInfo({ ...item, astro: weather?.astro })
                                                }} 
                                                weatherInfo={item}
                                                unit = {unit} astro={weather.astro}
                                            ></WeatherInfoHorizontal>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index}
                                    ></FlatList>
                                </View>
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