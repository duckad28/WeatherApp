import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Text,
    ScrollView,
    StyleSheet,
    Modal,
    Image,
    ActivityIndicator,
    RefreshControl,
    Animated,
    Dimensions,
    LogBox
} from 'react-native';
import { SmallButton, BigTemperature, Temperature, WeatherInfoH, Button, WeatherHourlyV, ExtraInfoItem } from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import LottieView from 'lottie-react-native';

import { faCircle, faClock, faEllipsisV, faLocationArrow, faMoon, faPlus, faSun } from '@fortawesome/free-solid-svg-icons';
import { images, colors, fontSizes } from '../constants';
import { getDayOfWeek, getWeatherIcon, cToF } from '../utilities';

import GeoLocation from "@react-native-community/geolocation";
import { fetchForecast, fetchGeo } from '../repositories/fetchData';
import { debounce } from 'lodash';
import { getLocationData, storeLocationData } from '../utilities/locationStorage';
import { getData, storeData } from '../utilities/asyncStorage';

const MainScreen = (props) => {
    const { navigation } = props;
    const { route } = props;
    const { navigate } = navigation;

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;


    let [isModalVisible, setModalVisible] = useState(false);
    let [isSetting, setSetting] = useState(false);
    let [isReportSelected, setReportSelected] = useState(false);
    let [isSettingSelected, setSettingSelected] = useState(false);
    let [currentLocation, setCurrentLocation] = useState({});
    let [isFetched, setIsFetched] = useState(false);
    let [refreshing, setRefreshing] = useState(false);
    let [weatherLocations, setWeatherLocations] = useState([{location: 'Ha Noi'}, {location: 'London'}]);
    let [weatherDatas, setWeatherDatas] = useState([]);
    let [celUnit, setCelUnit] = useState(true);
    let [locationPermission, setLocationPermission] = useState(route.params.permission)
    //Lay dia chi chi tiet tu toa do
    const reverseGeoCode = async ({ lat, long }) => {
        fetchGeo({ lat: lat, long: long })
            .then(data => {
                if (data) {
                    setCurrentLocation(data.items[0]);
                }
            }
            )
    };

    const fetchWeatherDatas = () => {
        const temp = [];
        const data = weatherLocations.map(async ({location}) => {
            fetchForecast({cityName: location})
                .then((data) => {
                    let t = data?.forecast?.forecastday[0]?.hour;
                    temp.push({
                        location: location,
                        imageBackground: (data?.current?.is_day == 1) ? images.image4 : images.image3,
                        aqiData: data?.current?.air_quality,
                        currentData: data?.current,
                        forecastData: data?.forecast?.forecastday,
                        extraInfoData: [
                            {
                                name: 'Humidity',
                                value: Math.round(data?.current?.humidity) + "%"
                            },
                            {
                                name: 'Pressure',
                                value: Math.round(data?.current?.pressure_mb) + "hPa"
                            },
                            {
                                name: 'UV',
                                value: Math.round(data?.current?.uv)
                            },
                            {
                                name: 'Real feel',
                                value: Math.round(data?.current?.feelslike_c)
                            }
                        ],
                        briefForcast: [
                            {
                                date: data.forecast.forecastday[0].date,
                                dayOfWeeks: 'Today',
                                highestTemp: Math.round(data.forecast.forecastday[0].day.maxtemp_c),
                                lowestTemp: Math.round(data.forecast.forecastday[0].day.mintemp_c),
                                weather: data.forecast.forecastday[0].day.condition.text,
                                icon: data.forecast.forecastday[0].day.condition.icon,
                            },
                            {
                                date: data.forecast.forecastday[1].date,
                                dayOfWeeks: 'Tomorrow',
                                highestTemp: Math.round(data.forecast.forecastday[1].day.maxtemp_c),
                                lowestTemp: Math.round(data.forecast.forecastday[1].day.mintemp_c),
                                weather: data.forecast.forecastday[1].day.condition.text,
                                icon: data.forecast.forecastday[1].day.condition.icon,
                            },
                            {
                                date: data.forecast.forecastday[2].date,
                                dayOfWeeks: getDayOfWeek(data.forecast.forecastday[2].date),
                                highestTemp: Math.round(data.forecast.forecastday[2].day.maxtemp_c),
                                lowestTemp: Math.round(data.forecast.forecastday[2].day.mintemp_c),
                                weather: data.forecast.forecastday[2].day.condition.text,
                                icon: data.forecast.forecastday[2].day.condition.icon,
                            },
                        ],
                        maxTempInDay: Math.max.apply(Math, t.map(function (weather) {
                            return weather?.temp_c;
                        }))
                    })
                })
         });
        setWeatherDatas(temp)
    }

    const handleRefresh = () => {
        setRefreshing(true);
        fetchLocations();
        fetchWeatherDatas();
        setRefreshing(false);
    }


    const handleAccessLocation = () => {
            GeoLocation.getCurrentPosition(position => {
                if (position.coords) {
                    reverseGeoCode({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                    });
    
                }
            })
            if (currentLocation.address?.city) {
                const temp = [...weatherDatas]
    
                if (temp[0]?.location !== currentLocation?.address?.city) {
                fetchForecast({cityName:  currentLocation?.position?.lat + ", " + currentLocation?.position?.lng})
                    .then((data) => {
                        let t = data?.forecast?.forecastday[0]?.hour;
                        temp.unshift({
                            location: currentLocation?.address?.city,
                            imageBackground: (data?.current?.is_day == 1) ? images.image4 : images.image3,
                            aqiData: data?.current?.air_quality,
                            currentData: data?.current,
                            forecastData: data?.forecast?.forecastday,
                            extraInfoData: [
                                {
                                    name: 'Humidity',
                                    value: Math.round(data?.current?.humidity) + "%"
                                },
                                {
                                    name: 'Pressure',
                                    value: Math.round(data?.current?.pressure_mb) + "hPa"
                                },
                                {
                                    name: 'UV',
                                    value: Math.round(data?.current?.uv)
                                },
                                {
                                    name: 'Real feel',
                                    value: Math.round(data?.current?.feelslike_c)
                                }
                            ],
                            briefForcast: [
                                {
                                    date: data.forecast.forecastday[0].date,
                                    dayOfWeeks: 'Today',
                                    highestTemp: Math.round(data.forecast.forecastday[0].day.maxtemp_c),
                                    lowestTemp: Math.round(data.forecast.forecastday[0].day.mintemp_c),
                                    weather: data.forecast.forecastday[0].day.condition.text,
                                    icon: data.forecast.forecastday[0].day.condition.icon,
                                },
                                {
                                    date: data.forecast.forecastday[1].date,
                                    dayOfWeeks: 'Tomorrow',
                                    highestTemp: Math.round(data.forecast.forecastday[1].day.maxtemp_c),
                                    lowestTemp: Math.round(data.forecast.forecastday[1].day.mintemp_c),
                                    weather: data.forecast.forecastday[1].day.condition.text,
                                    icon: data.forecast.forecastday[1].day.condition.icon,
                                },
                                {
                                    date: data.forecast.forecastday[2].date,
                                    dayOfWeeks: getDayOfWeek(data.forecast.forecastday[2].date),
                                    highestTemp: Math.round(data.forecast.forecastday[2].day.maxtemp_c),
                                    lowestTemp: Math.round(data.forecast.forecastday[2].day.mintemp_c),
                                    weather: data.forecast.forecastday[2].day.condition.text,
                                    icon: data.forecast.forecastday[2].day.condition.icon,
                                },
                            ],
                            maxTempInDay: Math.max.apply(Math, t.map(function (weather) {
                                return weather?.temp_c;
                            }))
                        })
                        
                    })
                
                setRefreshing(true);
                setWeatherDatas(temp)
                setRefreshing(false);
                }
                else {
                alert("trung")
            }
        }
    }

    const fetchLocations = async() => {
        let locations = await getLocationData('locations');
        if (locations) {
            setWeatherLocations(locations)
        }
        let isPermission = await getData('LocationPermission');
        setLocationPermission(isPermission == "true")
        await delay(2000)
        setIsFetched(true)
    }

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        fetchLocations();
        fetchWeatherDatas();
    }, [route.params.cityName, route.params.permission])


    if (isFetched == false) {
        return <HomeView></HomeView>
    }


    if (isFetched) {
        return (
            <View style={{
                flex: 1, backgroundColor: 'white'
            }}

            >
                <FlatList
                nestedScrollEnabled
                    data={weatherDatas}
                    pagingEnabled
                    horizontal
                    showsHorizontalScrollIndicator
                    renderItem={(weatherDataItem) => {
                        return (
                            <View style={{ width: windowWidth }}>
                                {/**------------------------App---------------------------- */}
                                <ImageBackground source={weatherDataItem?.item?.imageBackground} style={{ flex: 1 }} resizeMode='stretch'>

                                    {/*---------Header---------*/}
                                    <View style={{
                                        flex: 1, paddingVertical: 10
                                    }}>

                                        <View style={{
                                            flex: 1, flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <TouchableOpacity onPress={() => [setSetting(false), navigate('LocationScreen')]}>
                                                <FontAwesomeIcon icon={faPlus} size={fontSizes.iconSize} color={colors.textColor}></FontAwesomeIcon>
                                            </TouchableOpacity>

                                            <Text style={{
                                                fontSize: fontSizes.h4, color: colors.textColor
                                            }}>{weatherDataItem?.item?.location}</Text>

                                            {/**-------------Setting selection------------------------ */}
                                            <TouchableOpacity onPress={() => [setSetting(true), setReportSelected(false), setSettingSelected(false), setModalVisible(true)]}>
                                                <FontAwesomeIcon icon={faEllipsisV} size={fontSizes.iconSize} color={colors.textColor}></FontAwesomeIcon>
                                            </TouchableOpacity>
                                            {/**---------------------Modal------------------------- */}
                                            <Modal visible={isModalVisible} transparent={true}>
                                                <TouchableOpacity onPress={() => [setModalVisible(false), setSetting(false)]} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
                                                    <View style={{ height: 20, width: '100%' }}></View>
                                                    {isSetting && <View style={{
                                                        margin: 20,
                                                        width: 160,
                                                        height: 80,
                                                        backgroundColor: 'white',
                                                        justifyContent: 'space-around',
                                                        alignItems: 'flex-start',
                                                        alignSelf: 'flex-end',
                                                        borderRadius: 15,
                                                        overflow: 'hidden'
                                                    }}>

                                                        <TouchableOpacity onPress={() => {
                                                            setSetting(false);
                                                            setSettingSelected(false);
                                                            setReportSelected(true);
                                                            setModalVisible(false)
                                                            navigate('WeatherReportScreen');
                                                        }} style={{
                                                            flex: 1, width: '100%',
                                                            backgroundColor: isReportSelected ? colors.backgroundColor : null,
                                                        }}>
                                                            <Text style={normalTextStyle}>Report</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress={() => {
                                                            setSetting(false);
                                                            setReportSelected(false);
                                                            setSettingSelected(true);
                                                            setModalVisible(false)
                                                            navigate('SettingScreen')
                                                        }} style={{
                                                            flex: 1, width: '100%',
                                                            backgroundColor: isSettingSelected ? colors.backgroundColor : null,
                                                        }}>
                                                            <Text style={normalTextStyle}>Setting</Text>
                                                        </TouchableOpacity>

                                                    </View>}
                                                </TouchableOpacity>
                                            </Modal>
                                            {/**---------------------Modal end------------------------- */}
                                        </View>

                                        <View style={{
                                            flex: 1, alignItems: 'center'
                                        }}>
                                            <SmallButton content={'Allow Weather to access your location'}
                                                onPress={() => {
                                                    if(locationPermission) {
                                                        handleAccessLocation()
                                                    } else {
                                                        navigate('LocationPermissionScreen', {permission: locationPermission});
                                                    }
                                                    
                                                }}
                                            >
                                            </SmallButton>

                                            <View style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: 10
                                            }}>
                                                <FontAwesomeIcon icon={faLocationArrow} size={fontSizes.iconSizeM} color={colors.textColor}></FontAwesomeIcon>
                                                <View style={{ width: 10 }}></View>
                                                <FontAwesomeIcon icon={faCircle} size={fontSizes.iconSizeSSS} color={colors.textColor}></FontAwesomeIcon>
                                            </View>
                                        </View>
                                    </View>




                                    {/*------------Body------------*/}
                                    <View style={{
                                        flex: 10
                                    }}>
                                        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}
                                            style={{
                                                flex: 10
                                            }}
                                            refreshControl={
                                                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                                            }
                                        >
                                            {/*------------Current Temperature.------------*/}
                                            <View style={{
                                                height: 400
                                            }}>
                                                <View style={{
                                                    flex: 1,
                                                    marginTop: 40,
                                                }}>
                                                    <BigTemperature
                                                        currentTemp={
                                                            celUnit ? Math.round(weatherDataItem?.item?.currentData?.temp_c) : cToF(weatherDataItem?.item?.currentData?.temp_c)
                                                    } unit={celUnit}></BigTemperature>
                                                </View>

                                                <View style={{
                                                    flex: 1,
                                                }}>
                                                    <View style={{
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Text style={{ color: colors.textColor, fontSize: fontSizes.h4, width: 120 }}>{weatherDataItem?.item?.currentData?.condition?.text}</Text>
                                                        <View style={{ width: 20 }}></View>
                                                        <Temperature highest={Math.round(weatherDataItem?.item?.forecastData[0]?.day?.maxtemp_c)}
                                                            lowest={Math.round(weatherDataItem?.item?.forecastData[0]?.day?.mintemp_c)}
                                                            unit={celUnit}
                                                            fontSize={fontSizes.h4}></Temperature>

                                                    </View>

                                                    <View style={{
                                                        flex: 6,
                                                        justifyContent: 'center',
                                                    }}>
                                                        <View style={{
                                                            flex: 1,
                                                            marginHorizontal: 30,
                                                            justifyContent: 'space-evenly',
                                                            alignItems: 'center',
                                                            flexDirection: 'row'
                                                        }}>
                                                            <SmallButton content={'AQI'} onPress={() => navigate('AqiScreen', { data: weatherDataItem?.item?.aqiData })}></SmallButton>
                                                            <View style={{
                                                                paddingHorizontal: 10,
                                                                paddingVertical: 2,
                                                                borderRadius: 15,
                                                                backgroundColor: colors.buttonColor,
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}>
                                                                <Image source={images[getWeatherIcon(weatherDataItem?.item?.currentData?.condition?.icon)]} style={{ tintColor: '#ffffff', width: 20, height: 16, justifyContent: 'center' }}></Image>
                                                            </View>
                                                        </View>
                                                        <View style={{ flex: 1 }}></View>
                                                    </View>
                                                </View>
                                            </View>

                                            {/*------------DailyForeCast------------*/}
                                            <View style={{
                                                height: 300
                                            }}>
                                                <View style={{ flex: 1, marginHorizontal: 10, marginVertical: 20, backgroundColor: colors.backgroundColor, borderRadius: 20 }}>
                                                    <View style={{
                                                        flex: 2,
                                                        marginHorizontal: 15,
                                                        flexDirection: 'column',
                                                    }}>
                                                        <FlatList
                                                            showsVerticalScrollIndicator={false}
                                                            style={{
                                                                flexDirection: 'column',
                                                                flexGrow: 0,
                                                            }}
                                                            data={weatherDataItem?.item?.briefForcast}
                                                            renderItem={({ item }) => {
                                                                return <View><WeatherInfoH weatherInfo={item} unit={celUnit}></WeatherInfoH></View>
                                                            }}
                                                            keyExtractor={item => item.date}
                                                        >
                                                        </FlatList>
                                                    </View>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Button onPress={() => navigate('UpcomingWeatherScreen', { data: weatherDataItem?.item?.forecastData, background: weatherDataItem?.item?.imageBackground, unit: celUnit })} content={'Daily Forecast'} ></Button>
                                                    </View>
                                                </View>
                                            </View>

                                            {/*------------HourLyForecast------------*/}
                                            <View style={{
                                                backgroundColor: colors.backgroundColor, height: 250, margin: 10, marginTop: 0, borderRadius: 15,
                                                
                                            }}>
                                                {/*------------Header------------*/}
                                                <View style={{
                                                    marginLeft: 10,
                                                    marginVertical: 10,
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}>
                                                    <FontAwesomeIcon icon={faClock} color={colors.textColor}></FontAwesomeIcon>
                                                    <View style={{ width: 10 }}></View>
                                                    <Text style={textStyle}>24 hours forecast</Text>
                                                </View>

                                                {/*------------Info------------*/}
                                                <ScrollView nestedScrollEnabled showsHorizontalScrollIndicator={false} horizontal style={{flex: 1, flexDirection: 'row' }}>
                                                    {weatherDataItem?.item?.forecastData[0]?.hour.map((item, index) => {
                                                        return (<WeatherHourlyV
                                                            key = {index}
                                                            unit = {celUnit}
                                                            max={weatherDataItem?.item?.maxTempInDay}
                                                            temp={Math.round(item.temp_c)}
                                                            hour={item.time}
                                                            icon={item.condition.icon}>

                                                        </WeatherHourlyV>)
                                                    })}
                                                    {/* <FlatList
                                                        showsHorizontalScrollIndicator={false}
                                                        data={weatherDataItem?.item?.forecastData[0]?.hour}
                                                        renderItem={({ item }) => {
                                                            return <WeatherHourlyV max={weatherDataItem?.item?.maxTempInDay} temp={Math.round(item.temp_c)} hour={item.time} icon={item.condition.icon}></WeatherHourlyV>
                                                        }}
                                                        keyExtractor={(item, index) => index}>    
                                                    </FlatList> */}

                                                </ScrollView>
                                            </View>

                                            {/*------------Extra Information------------*/}
                                            <View style={{
                                                height: 200, marginHorizontal: 5, flexDirection: 'row'
                                            }}>
                                                {/*------------RiseSetTime------------*/}
                                                <View style={{
                                                    flex: 1,
                                                }}>
                                                    <View style={{
                                                        flex: 1,
                                                        backgroundColor: colors.backgroundColor,
                                                        margin: 5,
                                                        borderRadius: 10,
                                                        justifyContent: 'space-evenly'
                                                    }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                            <Text style={textStyle}>{weatherDataItem?.item?.forecastData[0].astro.sunrise}</Text>
                                                            <Text style={{ ...textStyle, fontSize: fontSizes.h6, color: colors.fadeTextColor }}>Sunrise</Text>
                                                        </View>
                                                        <View style={{ height: 1, backgroundColor: colors.fadeTextColor, marginHorizontal: 20 }}></View>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                            <Text style={textStyle}>{weatherDataItem?.item?.forecastData[0].astro.sunset}</Text>
                                                            <Text style={{ ...textStyle, fontSize: fontSizes.h6, color: colors.fadeTextColor }}>Sunset</Text>
                                                        </View>
                                                    </View>

                                                    <View style={{
                                                        flex: 1,
                                                        backgroundColor: colors.backgroundColor,
                                                        margin: 5,
                                                        borderRadius: 10,
                                                        justifyContent: 'space-evenly'
                                                    }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                            <Text style={textStyle}>{weatherDataItem?.item?.forecastData[0].astro.moonrise}</Text>
                                                            <Text style={{ ...textStyle, fontSize: fontSizes.h6, color: colors.fadeTextColor }}>Moonrise</Text>
                                                        </View>
                                                        <View style={{ height: 1, backgroundColor: colors.fadeTextColor, marginHorizontal: 20 }}></View>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                            <Text style={textStyle}>{weatherDataItem?.item?.forecastData[0].astro.moonset}</Text>
                                                            <Text style={{ ...textStyle, fontSize: fontSizes.h6, color: colors.fadeTextColor }}>Moonset</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                                {/*------------ExtraInfor------------*/}
                                                <View style={{
                                                    flex: 1,
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    backgroundColor: colors.backgroundColor,
                                                    borderRadius: 10,
                                                    margin: 5
                                                }}>
                                                    <FlatList
                                                        data={weatherDataItem?.item?.extraInfoData}
                                                        renderItem={({ item }) => {
                                                            if (!celUnit) {
                                                                if (item.name == 'Real feel') {
                                                                    item.value = cToF(item.value)
                                                                }
                                                            }
                                                            return <ExtraInfoItem data={item} height={28} nameStyle={nameTextStyle} valueStyle={valueTextStyle}></ExtraInfoItem>
                                                        }}
                                                        keyExtractor={item => item.name}>

                                                    </FlatList>
                                                </View>
                                            </View>
                                        </ScrollView>
                                    </View>

                                </ImageBackground>
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => index}
                    ></FlatList>


            </View>
        )
    }
}


const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const HomeView = (props) => {
    let [check, setCheck] = useState(false);
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <LottieView
                source={require("../assets/animations/animation.json")}
                style={{ width: "100%", height: "100%" }}
                autoPlay
                loop
            />
        </View>
    )
}




const normalTextStyle = StyleSheet.create({
    fontSize: fontSizes.h5,
    color: colors.fadeBlackTextColor,
    fontWeight: '500',
    textAlignVertical: 'center',
    margin: 10
})
const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center',
})
const nameTextStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})
const valueTextStyle = StyleSheet.create({
    color: colors.fadeTextColor, fontSize: fontSizes.h6, textAlignVertical: 'center'
})


const commonStyle = StyleSheet.create({
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
})
export default MainScreen;