import React, {useState} from 'react';
import {  Text, View, FlatList, TouchableOpacity, ImageBackground, StyleSheet, Image } from 'react-native';
import { colors, fontSizes, images, styles } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { WeatherInfoV, Temperature } from '../components';
import { faCloud, faCloudRain, faTint, faSun } from '@fortawesome/free-solid-svg-icons';
import { getDayOfWeek, getTimeOfDay } from '../utilities';
import DayInfoScreen from './DayInfoScreen';

const WeatherInfoHorizontal = (props) => {
    let {dt_txt, main , weather, rain} = props.weatherInfo;
    let dayOfWeeks = getDayOfWeek(dt_txt);
    let timeOfDay = getTimeOfDay(dt_txt);
    let mainWeather = weather[0].main;
    let highestTemp = Math.round(main.temp_max);
    let lowestTemp = Math.round(main.temp_min);
    let icon = '/openweathermap.org/img/w/' + weather[0].icon +'.png';
    let rainPos = 0;
    if (rain !== undefined) {
        rainPos = rain["3h"]
    }
    return (
        <TouchableOpacity onPress = {props.onPress}>
            <View style={{...containerStyle, borderBottomColor: colors.borderColor, borderBottomWidth: 1}}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                <Image source={{uri: 'https:' + icon}} style={{width: 32, height: 32}}></Image>
                <View style={{ width: 10 }}></View>
                <Text style={{...textStyle, width: 40}}>{dayOfWeeks}</Text>
                <View style={{ width: 10 }}></View>
                <Text style={textStyle}>{timeOfDay}</Text>
                <View style={{ width: 10 }}></View>
                <Text style={textStyle}>{mainWeather}</Text>
                
            </View>

            <View style={{ flexDirection: 'row',paddingHorizontal: 25, alignItems: 'center', width: 100 }}>
                <FontAwesomeIcon icon={faTint} color={colors.textColor}></FontAwesomeIcon>
                <View style={{width: 5}}></View>
                <Text style={textStyle}>{rainPos}</Text>
            </View>
            
            <Temperature highest={highestTemp} lowest={lowestTemp} fontSize={fontSizes.h5}></Temperature>
        </View>
        </TouchableOpacity>
        
    )
}
const UpcomingWeatherScreen = (props) => {
    const { navigation } = props;
    const { navigate } = navigation;
    const { route } = props;
    let weatherData = route.params.data;
    let [weatherInfo, setWeatherInfo] = useState({});
    let [isGraph, setGraph] = useState(true);
    let [isList, setList] = useState(false);
    let [isModalVisible, setModalVisble] = useState(false);
    let max = Math.max.apply(Math, weatherData.map(function (weather) {
        return weather.main.temp_max;
    }))
    let min = Math.min.apply(Math, weatherData.map(function (weather) {
        return weather.main.temp_min;
    }))
    return (
        
        <ImageBackground source={images.image3} style={{ flex: 1 }}>
            {isModalVisible && <DayInfoScreen isVisible={isModalVisible} setVisible = {setModalVisble} data = {weatherInfo}></DayInfoScreen>}
            <View style={{ flex: 1, padding: 10 }}>
                <TouchableOpacity onPress={() => navigate('MainScreen')} style={{ height: 40 }}>
                    <FontAwesomeIcon icon={faArrowLeft} size={26} color={colors.textColor}></FontAwesomeIcon>
                </TouchableOpacity>

                <View style={{ height: 60 }}>
                    <Text style={{ fontSize: 30, color: colors.textColor }}>Weather forecast</Text>
                </View>

                {/** ---------------- Button ----------------- */}
                <View style={{ height: 60,flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                            borderRadius: 10,height: 40, width: 60,
                            justifyContent: 'center', alignItems: 'center'
                            }}>
                                
                            <Text style={{...textStyle, color: isGraph ? colors.textColor : colors.fadeBlackTextColor}}>GRAPH</Text>
                        </TouchableOpacity> 

                        <View style={{width: 5}}></View>

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
                            borderRadius: 10,height: 40, width: 60,
                            justifyContent: 'center', alignItems: 'center'
                            }}>
                                
                            <Text style={{...textStyle, color: isList ? colors.textColor : colors.fadeBlackTextColor}}>LIST</Text>
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
                                return <WeatherInfoV weatherInfo={item} max = {max} min = {min}></WeatherInfoV>
                            }}
                            keyExtractor={item => item.dt}>

                        </FlatList>

                </View>
                }
                {/** ---------------- By List ----------------- */}
                {
                    isList && <View style={{ height: 500, flexDirection: 'column' }}>
                        <FlatList data={weatherData}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                return <WeatherInfoHorizontal onPress = {()=> {
                                    setModalVisble(true)
                                    setWeatherInfo(item)
                                }} weatherInfo={item}></WeatherInfoHorizontal>
                            }}
                            keyExtractor={item => item.dt}>

                        </FlatList>

                </View>
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
    marginTop : 20,
    height: 40
})
export default UpcomingWeatherScreen;