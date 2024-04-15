import React, {useState} from 'react';
import {  Text, View, FlatList, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { colors, fontSizes, images, styles } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { WeatherInfoV, Temperature } from '../components';
import { faCloud, faCloudRain, faTint, faSun } from '@fortawesome/free-solid-svg-icons';
import DayInfoScreen from './DayInfoScreen';

const WeatherInfoHorizontal = (props) => {
    let {highestTemp, lowestTemp, weather, dayOfWeeks} = props.weatherInfo;
    let  icon = (weather == 'Cloudy') ? faCloud : (weather == 'Sunny' ? faSun : (weather == 'Rainy') ? faCloudRain : faSun);
    return (
        <TouchableOpacity onPress = {props.onPress}>
            <View style={containerStyle}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                <FontAwesomeIcon icon={icon} color={colors.textColor}></FontAwesomeIcon>
                <View style={{ width: 10 }}></View>
                <Text style={textStyle}>{dayOfWeeks}</Text>
                <View style={{ width: 10 }}></View>
                <Text style={textStyle}>{weather}</Text>
                
            </View>

            <View style={{ flexDirection: 'row',paddingHorizontal: 25, alignItems: 'center' }}>
                <FontAwesomeIcon icon={faTint} color={colors.textColor}></FontAwesomeIcon>
                <View style={{width: 5}}></View>
                <Text style={textStyle}>20%</Text>
            </View>
            
            <Temperature highest={highestTemp} lowest={lowestTemp} fontSize={fontSizes.h5}></Temperature>
        </View>
        </TouchableOpacity>
        
    )
}
const UpcomingWeatherScreen = (props) => {
    const { navigation } = props;
    const { navigate } = navigation;
    let [isGraph, setGraph] = useState(true);
    let [isList, setList] = useState(false);
    let [isModalVisible, setModalVisble] = useState(false);
    return (
        <ImageBackground source={images.image3} style={{ flex: 1 }}>
            <DayInfoScreen isVisible={isModalVisible} setVisible = {setModalVisble}></DayInfoScreen>
            <View style={{ flex: 1, padding: 10 }}>
                <TouchableOpacity onPress={() => navigate('MainScreen')} style={{ height: 40 }}>
                    <FontAwesomeIcon icon={faArrowLeft} size={26} color={colors.textColor}></FontAwesomeIcon>
                </TouchableOpacity>

                <View style={{ height: 60 }}>
                    <Text style={{ fontSize: 30, color: colors.textColor }}>10-day forecast</Text>
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
                    isGraph && <View style={{ height: 400, flexDirection: 'row' }}>
                        <FlatList data={D}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => {
                                return <WeatherInfoV weatherInfo={item}></WeatherInfoV>
                            }}
                            keyExtractor={item => item.date}>

                        </FlatList>

                </View>
                }
                {/** ---------------- By List ----------------- */}
                {
                    isList && <View style={{ height: 500, flexDirection: 'column' }}>
                        <FlatList data={D}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                return <WeatherInfoHorizontal onPress = {()=> setModalVisble(true)} weatherInfo={item}></WeatherInfoHorizontal>
                            }}
                            keyExtractor={item => item.date}>

                        </FlatList>

                </View>
                }
                <View style={{ flex: 1 }}></View>
            </View>
        </ImageBackground>

    )
}

const D = [
    { date:'08/04', highestTemp: 30, lowestTemp: 26, dayOfWeeks: 'Today', weather: 'Cloudy',  },
    { date:'09/04', highestTemp: 30, lowestTemp: 25, dayOfWeeks: 'Tomorrow', weather: 'Rainy',  },
    { date:'10/04', highestTemp: 34, lowestTemp: 23, dayOfWeeks: 'Mon', weather: 'Sunny',  },
    { date:'11/04', highestTemp: 33, lowestTemp: 28, dayOfWeeks: 'Tue', weather: 'Sunny',  },
    { date:'12/04', highestTemp: 34, lowestTemp: 29, dayOfWeeks: 'Wed', weather: 'Sunny',  },
    { date:'13/04', highestTemp: 34, lowestTemp: 23, dayOfWeeks: 'Mon', weather: 'Sunny',  },
    { date:'14/04', highestTemp: 33, lowestTemp: 28, dayOfWeeks: 'Tue', weather: 'Sunny',  },
    { date:'15/04', highestTemp: 34, lowestTemp: 29, dayOfWeeks: 'Wed', weather: 'Sunny',  },
    { date:'16/04', highestTemp: 33, lowestTemp: 28, dayOfWeeks: 'Tue', weather: 'Cloudy',  },
    { date:'17/04', highestTemp: 34, lowestTemp: 29, dayOfWeeks: 'Wed', weather: 'Cloudy',  },
]
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