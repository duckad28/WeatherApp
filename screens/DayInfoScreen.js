import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Modal,
    TouchableOpacity,
    StyleSheet,
    FlatList, Image
} from 'react-native';
import { colors, fontSizes, images, viText } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { ExtraInfoItem } from '../components';
import { cToF, getWeatherIcon } from '../utilities';

const dayOfWeeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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

const aqiEn = [
    'No value',
    'Excellent',
    'Fair',
    'Poor',
    'Unhealthy',
    'Very Unhealthy',
    'Dangerous',
]
const aqiVn = [
    'Không có dữ liệu',
    'Tuyệt vời',
    'Vừa phải',
    'Xấu',
    'Có hại',
    'Rất có hại',
    'Nguy hiểm',
]


const en = [ 'Rain probablity','RealFeel','Humidity','Cloud','Wind speed','Wind direction','Wind gust','UV','AQI','Rise', 'Set', 'hrs', 'mins'];
const vn = [ 'Khả năng có mưa','Nhiệt độ cảm nhận','Độ ẩm','Mây','Tốc độ gió','Hướng gió','Gió giật','UV','AQI','Mọc', 'Lặn', 'giờ', 'phút'];
const getDayOfWeek = (day) => {
    let t = new Date(day);
    return dayOfWeeks[t.getDay()];
}


const getTimeDuration = (rise, set) => {
    let [timeRise, modifierRise] = rise.split(' ');
    let [hoursRise, minutesRise] = timeRise.split(':');
    let [timeSet, modifierSet] = set.split(' ');
    let [hoursSet, minutesSet] = timeSet.split(':');

    let riseTime = { hours: parseInt(hoursRise, 10), minutes: parseInt(minutesRise, 10) };
    let setTime = { hours: parseInt(hoursSet, 10), minutes: parseInt(minutesSet, 10) };
    if (modifierRise === modifierSet) {
        if (setTime.hours >= riseTime.hours) {
            let min = setTime.minutes - riseTime.minutes + 60;
            let hour = setTime.hours - riseTime.hours - 1;
            if (min >= 60) {
                min = min - 60;
                hour = hour + 1;
            }
            return { hours: hour, minutes: min }
        } else {
            let min = setTime.minutes - riseTime.minutes + 60;
            let hour = setTime.hours + 23 - riseTime.hours;
            if (min >= 60) {
                min = min - 60;
                hour = hour + 1;
            }
            return { hours: hour, minutes: min }
        }
    }
    let min = setTime.minutes - riseTime.minutes + 60;
    let hour = setTime.hours + 11 - riseTime.hours;
    if (min >= 60) {
        min = min - 60;
        hour = hour + 1;
    }
    return { hours: hour, minutes: min }
}

const DayInfoScreen = (props) => {
    let weatherData = props.data;
    let {route} = props;
    let {lang} = props;
    let lan = lang ? en : vn;
    let aqi = lang ? aqiEn : aqiVn;
    let { isVisible, setVisible, unit } = props;
    const dayInfoData = [
        {
            name: lan[0],
            value: Math.round(weatherData?.chance_of_rain) + "%"
        },
        {
            name: lan[1],
            value: (unit ? Math.round(weatherData?.feelslike_c) : cToF(weatherData?.feelslike_c)) + "°"
        },
        {
            name: lan[2],
            value: weatherData?.humidity + "%"
        },
        {
            name: lan[3],
            value: weatherData?.cloud + "%"
        },
        {
            name: lan[4],
            value: weatherData?.wind_kph + "km/h"
        },
        {
            name: lan[5],
            value: weatherData?.wind_dir
        },
        {
            name: lan[6],
            value: weatherData?.gust_kph + "km/h"
        },
        {
            name: lan[7],
            value: weatherData?.uv
        },
        {
            name: lan[8],
            value: aqi[weatherData?.air_quality["us-epa-index"]]
        }
    ]

    let highestTemp = Math.round(weatherData?.temp_c);
    let lowestTemp = Math.round(0);
    let sunrise = weatherData?.astro?.sunrise;
    let sunset = weatherData?.astro?.sunset;
    let moonrise = weatherData?.astro?.moonrise;
    let moonset = weatherData?.astro?.moonset;
    let sunDur = getTimeDuration(sunrise, sunset);
    let moonDur = getTimeDuration(moonrise, moonset);

    let day = getDayOfWeek(weatherData?.time);
    let cond = weatherData?.condition?.text;
    return (
        <Modal visible={isVisible} transparent={true} animationType='slide'>
            <View style={{
                flex: 1
            }}>
                <View style={{
                    height: 120
                }}>

                </View>


                <View style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    paddingHorizontal: 20
                }}>
                    <TouchableOpacity onPress={() => setVisible(false)} onS style={{ alignSelf: 'center', margin: 10 }}>
                        <View style={{
                            width: 60,
                            height: 10,
                            backgroundColor: colors.backgroundColor,
                            borderRadius: 5
                        }}>

                        </View>
                    </TouchableOpacity>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={headerStyle}>{lang ? day : dayOfWeeksVn[day]}</Text>
                        <Text style={normalTextStyle}>{weatherData?.time}</Text>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20
                    }}>
                        <Temperature temp={Math.round(weatherData?.temp_c)} condition={weatherData?.condition} fontSize={fontSizes.h1} unit={unit}></Temperature>
                        <Text>{lang ? cond : viText[cond.trim().toLowerCase()]}</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <FlatList
                            data={dayInfoData}
                            renderItem={({ item }) => {
                                return <ExtraInfoItem data={item} height={40} nameStyle={nameTextStyle} valueStyle={valueTextStyle}></ExtraInfoItem>
                            }}
                            keyExtractor={item => item.name}></FlatList>

                        <View style={{
                            height: 120,
                            borderBottomWidth: 1,
                            borderColor: colors.fadeTextColor,
                            flexDirection: 'row',
                            alignItems: 'center',
                            margin: 10,
                            justifyContent: 'space-between'
                        }}>
                            <View style={{
                                flex: 1, padding: 10, borderWidth: 1,
                                borderColor: colors.fadeTextColor,
                            }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faSun} size={24}></FontAwesomeIcon>
                                    <View>
                                        <Text>{sunDur.hours + " " + lan[11]}</Text>
                                        <Text>{sunDur.minutes + " " + lan[12]}</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>{lan[9]}</Text>
                                    <Text>{sunrise}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>{lan[10]}</Text>
                                    <Text>{sunset}</Text>
                                </View>
                            </View>

                            <View style={{
                                flex: 1, padding: 10, borderWidth: 1,
                                borderColor: colors.fadeTextColor,
                            }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faMoon} size={24}></FontAwesomeIcon>
                                    <View>
                                        <Text>{moonDur.hours + " " + lan[11]}</Text>
                                        <Text>{moonDur.minutes + " " + lan[12]}</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>{lan[9]}</Text>
                                    <Text>{moonrise}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>{lan[10]}</Text>
                                    <Text>{moonset}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>

    )
}



const Temperature = (props) => {
    let { temp, condition, unit } = props;
    return (
        <View style={{
            flexDirection: 'row',
        }}>
            <Image source={images[getWeatherIcon(condition?.icon)]} style={{ tintColor: '#000000', width: 60, height: 60, justifyContent: 'center', alignContent: 'center' }}></Image>
            <View style={{ width: 20 }}></View>
            <Text style={{ color: 'black', fontSize: 48 }}>{unit ? temp : cToF(temp)}°</Text>
        </View>
    )
}


const headerStyle = StyleSheet.create({
    fontSize: fontSizes.h4,
    color: 'black',
    fontWeight: '500'

})
const normalTextStyle = StyleSheet.create({
    fontSize: fontSizes.h6,
    color: colors.fadeBlackTextColor,
    fontWeight: '400',
    textAlignVertical: 'center',

})
const nameTextStyle = StyleSheet.create({
    fontSize: fontSizes.h5,
    color: colors.blackTextColor,
    fontWeight: '400',
    textAlignVertical: 'center',

})
const valueTextStyle = StyleSheet.create({
    fontSize: fontSizes.h6,
    color: colors.fadeBlackTextColor,
    fontWeight: '400',
    textAlignVertical: 'center',

})
const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})

export default DayInfoScreen;