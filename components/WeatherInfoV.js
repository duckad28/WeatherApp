import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { colors, fontSizes } from '../constants';
import { faCloud, faCloudRain, faMoon, faSun, faTint } from '@fortawesome/free-solid-svg-icons';
import { getDayOfWeek, getTimeOfDay, getDate } from '../utilities';

const WeatherInfoV = (props) => {
    let { dt_txt, main, weather, rain } = props.weatherInfo;
    let { max, min } = props;
    let dayOfWeeks = getDayOfWeek(dt_txt);
    let timeOfDay = getTimeOfDay(dt_txt);
    let date = getDate(dt_txt);
    let mainWeather = weather[0].main;
    let highestTemp = Math.round(main.temp_max);
    let dMax = Math.round(max) - highestTemp;
    let lowestTemp = Math.round(main.temp_min);
    let dMin = lowestTemp - Math.round(min);
    let icon = '/openweathermap.org/img/w/' + weather[0].icon + '.png';
    let rainPos = 0;
    if (rain !== undefined) {
        rainPos = rain["3h"]
    }
    return (
        <View style={{
            flexDirection: 'column',
            backgroundColor: 'red', borderWidth: 1, borderColor: colors.borderColor,
            flex: 1, width: 70, marginHorizontal: 2, paddingTop: 5,
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: (dayOfWeeks == 'Today') ? colors.backgroundColor : 'null',
            borderRadius: 10
        }}>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ ...textStyle, fontSize: fontSizes.h6 }}>{dayOfWeeks}</Text>
                <Text style={{ ...textStyle, fontSize: fontSizes.h7 }}>{date}</Text>
                <Text style={{ ...textStyle, fontSize: fontSizes.h7 }}>{timeOfDay}</Text>
            </View>

            <Image source={{ uri: 'https:' + icon }} style={{ width: 32, height: 32, marginTop: 20, marginBottom: 30 }}></Image>

            <View style={{
                flexDirection: 'column', height: 200, justifyContent: 'space-between', alignItems: 'center'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: dMax * 5 }}>
                    <Text style={textStyle}>{highestTemp}°</Text>
                </View>

                <View style={{
                    flex: 1,
                    width: 30,
                    borderWidth: 1,
                    borderColor: colors.borderColor,
                    borderRadius: 30,
                    marginVertical: 4
                }}>

                </View>

                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: dMin * 5 }}>
                    <Text style={textStyle}>{lowestTemp}°</Text>
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
                <Text style={{ ...textStyle, fontSize: fontSizes.h6 }}>{rainPos}</Text>
            </View>
        </View>
    )
}

const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})

export default WeatherInfoV;