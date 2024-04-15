import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {colors, fontSizes} from '../constants';

const WeatherHourlyV = (props) => {
    let {currentTemp, hour} = props.weather;
    let {icon} = props;
    return (
        <View style={{ flexDirection: 'column', flex: 1,width: 70, marginHorizontal: 2, justifyContent: 'space-around', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: colors.textColor, fontSize: 24 }}>{currentTemp}</Text>
                <View style={{
                }}>
                    <Text style={{ position: 'absolute', top: 0, fontSize: 12, color: colors.textColor }}>o</Text>
                </View>
            </View>
            <FontAwesomeIcon icon={icon} color={colors.textColor} size={18}></FontAwesomeIcon>
            <Text style={textStyle}>{hour}</Text>
        </View>
    )
}

const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})

export default WeatherHourlyV;