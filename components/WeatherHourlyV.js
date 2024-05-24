import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { getWeatherIcon } from '../utilities';
import {colors, fontSizes, images} from '../constants';

const WeatherHourlyV = (props) => {
    let {temp, hour} = props;
    let {max} = props;
    let dMax = Math.round(max) - temp;
    hour = toHour(hour);
    let {icon} = props;
    return (
        <View style={{
            flexDirection: 'column',
            height: 200,
            width: 70,
            marginHorizontal: 2,
            justifyContent: 'space-around',
            alignItems: 'center',
            }}>
            <View style={{ flexDirection: 'column', height: 100, justifyContent: 'flex-start', }}>
                <Text style={{ color: colors.textColor, fontSize: 20, marginTop: dMax*5}}>{temp}°</Text>
            </View>
            <Image source={images[getWeatherIcon(icon)]} style={{ tintColor: '#ffffff', width: 20, height: 16, justifyContent: 'center' }}></Image>
            <Text style={textStyle}>{hour}</Text>
        </View>
    )
}

const toHour = (date) => {
    hours = date.split(" ");
    return hours[1]
}

const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})

export default WeatherHourlyV;