import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {colors, fontSizes} from '../constants';
import { faCloud, faCloudRain, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const WeatherInfoV = (props) => {
    let {highestTemp, lowestTemp, weather, dayOfWeeks, date} = props.weatherInfo;
    let icon = (weather=="Sunny") ? faSun : (weather == 'Rainy' ? faCloudRain : (weather == 'Cloudy') ? faCloud : faSun)
    let iconNight = faMoon;
    return (
        <View style={{ flexDirection: 'column',
        flex: 1, width: 70, marginHorizontal: 2,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: (dayOfWeeks=='Today') ? colors.backgroundColor : 'null',
        borderRadius: 10}}>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{...textStyle, fontSize: fontSizes.h6}}>{dayOfWeeks}</Text>
                <Text style={{...textStyle, fontSize: fontSizes.h7}}>{date}</Text>
            </View>
            
            <View style={{ flexDirection: 'row' }}>
                <Text style={textStyle}>{highestTemp}</Text>
                <View style={{
                }}>
                    <Text style={{ position: 'absolute', top: 0, fontSize: 8, color: colors.textColor }}>o</Text>
                </View>
            </View>

            <FontAwesomeIcon icon={icon} color={colors.textColor} size={18}></FontAwesomeIcon>
            
            <View style={{ flexDirection: 'row' }}>
                <Text style={textStyle}>{lowestTemp}</Text>
                <View style={{
                }}>
                    <Text style={{ position: 'absolute', top: 0, fontSize: 8, color: colors.textColor }}>o</Text>
                </View>
            </View>

            <FontAwesomeIcon icon={iconNight} color={colors.textColor} size={18}></FontAwesomeIcon>
        </View>
    )
}

const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})

export default WeatherInfoV;