import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { colors, fontSizes, images } from '../constants';
import { getDayOfWeek, cToF, getWeatherIcon } from '../utilities';
import { faTint } from '@fortawesome/free-solid-svg-icons';

const WeatherInfoV = (props) => {
    let {day, date} = props.weatherInfo;
    let {unit, lang} = props;
    let {today} = props;
    let d = lang ? "Today" : "Hôm nay";
    let dayOfWeeks = today ? d : getDayOfWeek(date);
    let highestTemp = Math.round(day.maxtemp_c);
    let lowestTemp = Math.round(day.mintemp_c);
    let rainPos = day?.daily_chance_of_rain;
    let { max, min } = props;
    let dMax = Math.round(max) - highestTemp;
    let dMin = lowestTemp - Math.round(min);
    return (
        <View style={{
            flexDirection: 'column',
            backgroundColor: 'red', borderWidth: 1, borderColor: today ? 'white' : colors.borderColor,
            flex: 1, width: 70, marginHorizontal: 2, paddingTop: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: today ? colors.backgroundColor : 'null',
            borderRadius: 10
        }}>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ ...textStyle, fontSize: fontSizes.h6 }}>{dayOfWeeks}</Text>
                <Text style={{ ...textStyle, fontSize: fontSizes.h7 }}>{date.slice(5)}</Text>
            </View>

            <Image source={images[getWeatherIcon(day?.condition?.icon)]} style={{ tintColor: '#ffffff', width: 20, height: 16, justifyContent: 'center' }}></Image>                         
                
            <View style={{
                flexDirection: 'column', height: 200, justifyContent: 'space-between', alignItems: 'center'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: dMax * 10 }}>
                    <Text style={textStyle}>{unit ? highestTemp : cToF(highestTemp)}°</Text>
                </View>

                <View style={{
                    flex: 1,
                    width: 30,
                    borderWidth: 1,
                    borderColor: today ? 'white' : colors.borderColor,
                    borderRadius: 30,
                    marginVertical: 4
                }}>

                </View>

                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: dMin * 10 }}>
                    <Text style={textStyle}>{unit ? lowestTemp : cToF(lowestTemp)}°</Text>
                </View>
            </View>

            <View style={{
                width: '80%',
                height: 40,
                borderTopColor: colors.borderColor,
                borderTopWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 20
            }}>
                <FontAwesomeIcon icon={faTint} color={colors.textColor}></FontAwesomeIcon>
                <View style={{ width: 5 }}></View>
                <Text style={{ ...textStyle, fontSize: fontSizes.h6 }}>{rainPos}%</Text>
            </View>
        </View>
    )
}

const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})

export default WeatherInfoV;