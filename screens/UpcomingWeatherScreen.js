import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, ImageBackground, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { colors, fontSizes, images, styles, viText } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { WeatherInfoV } from '../components';
import { getDayOfWeek, getTimeOfDay, getWeatherIcon, cToF } from '../utilities';
import DayInfoScreen from './DayInfoScreen';
import TextTicker from 'react-native-text-ticker';
import { TabView, TabBar } from 'react-native-tab-view';

const en = ['Weather Forecast', 'DAYS', 'HOURS'];
const vn = ['Dự báo thời tiết', 'Theo ngày', 'Theo giờ'];
const dayOfWeeksVn = {
    'Monday': 'Thứ hai',
    'Tuesday': 'Thứ ba',
    'Wednesday': 'Thứ tư',
    'Thursday': 'Thứ năm',
    'Friday': 'Thứ sáu',
    'Saturday': 'Thứ bảy',
    'Sunday': 'Chủ nhật',
    'Today': 'Hôm nay'
}

const WeatherInfoHorizontal = (props) => {
    let { temp_c, time, condition, daily_chance_of_rain } = props.weatherInfo;
    let { unit, lang } = props;
    let timeOfDay = getTimeOfDay(time);
    let current_weather_condition = lang ? condition?.text : viText[condition?.text.trim().toLowerCase()];
    let text_length = current_weather_condition.length;
    let isLongText = text_length > 24;
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={{
                ...containerStyle,
                borderRadius: 10, marginHorizontal: 5, paddingHorizontal: 5, backgroundColor: colors.buttonColor
            }}>
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center'
                    }}
                >
                    <Image source={images[getWeatherIcon(condition?.icon)]}
                        style={{ tintColor: '#ffffff', width: 20, height: 16, justifyContent: 'center' }}
                    ></Image>
                    <View style={{ width: 10 }}></View>
                    <Text style={{ ...textStyle, width: 50 }}>{timeOfDay}</Text>
                    <View style={{ width: 10 }}></View>
                    {isLongText ? <TextTicker scrollSpeed={isLongText ? 40 : 0} loop={isLongText} bounce={false} numberOfLines={1} style={{
                        ...textStyle,
                        width: 160
                    }}>
                        {current_weather_condition}
                    </TextTicker> : <Text style={textStyle}>
                        {current_weather_condition}
                    </Text>}


                </View>
                <Text
                    style={{
                        color: colors.textColor,
                        fontSize: fontSizes.h6
                    }}
                >
                    {unit ? Math.round(temp_c) : cToF(temp_c)}°
                </Text>
            </View>
        </TouchableOpacity>

    )
}

const SecondRoute = ({ lan, day, unit, weatherData, lang }) => {
    let [weatherInfo, setWeatherInfo] = useState({});
    let [isModalVisible, setModalVisble] = useState(false);
    console.log(lang);

    return (
        <View style={{ flex: 1 }}>
            {isModalVisible && <DayInfoScreen isVisible={true} setVisible={setModalVisble} data={weatherInfo} unit={unit} lang={lang}></DayInfoScreen>}


            <ScrollView style={{ flexDirection: 'column' }} showsVerticalScrollIndicator={false}>
                {weatherData.map((weather, index) => {
                    let day = new Date(weather?.date);
                    let options = { weekday: 'long' };
                    let dayName = day.toLocaleDateString('en-US', options)
                    return (
                        <View key={index} style={{ borderWidth: 1, marginBottom: 40, paddingHorizontal: 5, borderColor: 'white' }}>
                            <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: fontSizes.h4, color: colors.textColor, textAlignVertical: 'center' }}>{lang ? dayName : dayOfWeeksVn[dayName]}</Text>
                                <Text style={{ fontSize: fontSizes.h4, color: colors.textColor, textAlignVertical: 'center' }}>{weather?.date}</Text>
                            </View>
                            <FlatList key={index} data={weather?.hour}
                                style={{ height: 300 }}
                                nestedScrollEnabled
                                showsVerticalScrollIndicator={true}

                                ListFooterComponent={
                                    <View style={{ height: 20 }}></View>
                                }
                                renderItem={({ item }) => {
                                    return (
                                        <WeatherInfoHorizontal
                                            onPress={() => {
                                                setModalVisble(true)
                                                setWeatherInfo({ ...item, astro: weather?.astro })
                                            }}
                                            weatherInfo={item}
                                            unit={unit} astro={weather.astro}
                                            lang={lang}
                                        ></WeatherInfoHorizontal>
                                    )
                                }}
                                keyExtractor={(item, index) => index}
                            ></FlatList>
                        </View>
                    )
                }
                )}
            </ScrollView>
        </View>
    )
}

const FirstRoute = ({ lan, day, unit, weatherData, lang }) => {

    let max = Math.max.apply(Math, weatherData.map(function (weather) {
        return weather?.day?.maxtemp_c;
    }))
    let min = Math.min.apply(Math, weatherData.map(function (weather) {
        return weather?.day?.mintemp_c;
    }))
    return (
        <View style={{ height: 400, flexDirection: 'row', marginTop: 20 }}>
            <FlatList data={weatherData}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return <WeatherInfoV
                        unit={unit}
                        weatherInfo={item}
                        max={max}
                        min={min}
                        today={day == index}
                        lang={lang}
                    ></WeatherInfoV>
                }}
                keyExtractor={item => item.date}>

            </FlatList>

        </View>
    )
}


const UpcomingWeatherScreen = (props) => {
    const { navigation } = props;
    const { navigate } = navigation;
    const { route } = props;
    let lang = route?.params?.lang;
    let [lan, setLan] = useState(route?.params?.lang ? en : vn);
    let weatherData = route.params.data;
    let day = route.params.day;
    let unit = route.params.unit;
    let imageBackground = route.params.background;

    const windowWidth = Dimensions.get('window').width;
    // let hourlyData = weatherData.reduce((acc, ele) => acc.concat(ele?.hour), [])

    const [index, setIndex] = React.useState(1);
    const [routes] = useState([
        { key: 'first', title: lan[1] },
        { key: 'second', title: lan[2] },
    ]);

    return (

        <ImageBackground source={imageBackground} style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 10 }}>
                <TouchableOpacity
                    onPress={() => navigate('MainScreen', { lang: route?.params?.lang, unit: route?.params?.unit })}
                    style={{ height: 40 }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} size={26} color={colors.textColor}></FontAwesomeIcon>
                </TouchableOpacity>

                <View style={{ height: 60 }}>
                    <Text style={{ fontSize: 30, color: colors.textColor }}>{lan[0]}</Text>
                </View>

                <TabView
                    renderTabBar={props => <TabBar {...props}
                    onTabPress={({ route, preventDefault }) => {
                          preventDefault();
                      }}
                    style={{marginBottom: 20, backgroundColor: null,}}
                        renderLabel={({ route, focused, color }) => (
                            <View style={{flex: 1,  width: windowWidth/2 - 10, justifyContent: 'center', alignItems: 'center',
                                border: 3, borderColor: 'black'
                            }}>
                                <Text style={textStyle}>
                                    {route.title}
                                </Text>
                            </View>
                        )}
                        indicatorStyle={{ backgroundColor: 'white' }} />}
                    navigationState={{ index, routes }}
                    renderScene={({ route }) => {
                        switch (route.key) {
                            case 'first':
                                return FirstRoute({ day: day, unit: unit, weatherData: weatherData, lan: lan, lang: lang });
                            case 'second':
                                return SecondRoute({ day: day, unit: unit, weatherData: weatherData, lan: lan, lang: lang });
                            default: break;
                        }
                    }}
                    onIndexChange={setIndex}
                    initialLayout={{ width: windowWidth }}
                />
            </View>
        </ImageBackground>

    )
}

const wrapperStyle = StyleSheet.create({
    flexGrow: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
})
const tabButtonSizeEn = StyleSheet.create({
    height: 40,
    width: 60,
    borderRadius: 10
})
const tabButtonSizeVn = StyleSheet.create({
    height: 50,
    width: 90,
    borderRadius: 20
})
const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})
const containerStyle = StyleSheet.create({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: 40
})
export default UpcomingWeatherScreen;