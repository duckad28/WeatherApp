import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { colors, fontSizes, images, viText } from '../constants';
import { Temperature } from '../components';
import { getWeatherIcon, cToF } from '../utilities';
import TextTicker from 'react-native-text-ticker';

const WeatherInfoH = (props) => {
    let { highestTemp, lowestTemp, weather, dayOfWeeks, icon } = props.weatherInfo;
    let { unit, lan } = props;
    let condition = lan ? weather : viText[weather.trim().toLowerCase()];
    let text_length = condition.length;
    let isAnimation = (text_length > 24);
    return (
        <View style={containerStyle}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                <Image source={images[getWeatherIcon(icon)]} style={{ tintColor: '#ffffff', width: 20, height: 16, justifyContent: 'center' }}></Image>
                <View style={{ width: 10 }}></View>
                <Text style={textStyle}>{dayOfWeeks}</Text>
                <View style={{ width: 10 }}></View>
                <TextTicker scrollSpeed={isAnimation ? 20 : 0} loop={isAnimation} bounce={false} numberOfLines={1} style={{
                    ...sTextStyle,
                    width: 150
                }}>
                    {condition}
                </TextTicker>
            </View>
            <Temperature highest={highestTemp} lowest={lowestTemp} fontSize={fontSizes.h5} unit={unit}></Temperature>
        </View>
    )
}

const containerStyle = StyleSheet.create({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: 40
})
const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})
const sTextStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h6, textAlignVertical: 'center'
})

export default WeatherInfoH;