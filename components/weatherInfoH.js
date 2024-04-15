import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {colors, fontSizes} from '../constants';
import {Temperature} from '../components';
import {faCloud, faCloudRain, faSun } from '@fortawesome/free-solid-svg-icons';


const WeatherInfoH = (props) => {
    let {highestTemp, lowestTemp, weather, dayOfWeeks} = props.weatherInfo;
    let  icon = (weather == 'Cloudy') ? faCloud : (weather == 'Sunny' ? faSun : (weather == 'Rainy') ? faCloudRain : faSun);
    return (
        <View style={containerStyle}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                <FontAwesomeIcon icon={icon} color={colors.textColor}></FontAwesomeIcon>
                <View style={{ width: 10 }}></View>
                <Text style={textStyle}>{dayOfWeeks}</Text>
                <View style={{ width: 10 }}></View>
                <Text style={textStyle}>{weather}</Text>
            </View>
            <Temperature highest={highestTemp} lowest={lowestTemp} fontSize={fontSizes.h5}></Temperature>
        </View>
    )
}

const containerStyle = StyleSheet.create({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop : 20,
    height: 40
})
const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})

export default WeatherInfoH;