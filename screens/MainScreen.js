import React, { useState, useEffect, useCallback, useRef } from 'react';
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

import { faCircle, faClock, faEllipsisV, faLocationArrow, faMoon, faPlus, faSun, faWifi } from '@fortawesome/free-solid-svg-icons';
import { images, colors, fontSizes } from '../constants';
import { getDayOfWeek, getWeatherIcon, cToF } from '../utilities';

import GeoLocation from "@react-native-community/geolocation";
import { fetchForecast, fetchGeo } from '../repositories/fetchData';
import { debounce, size } from 'lodash';
import { getLocationData, storeLocationData } from '../utilities/locationStorage';
import { getData, storeData } from '../utilities/asyncStorage';

import Rain from 'rainy-background-reactnative';

const en = ['Allow Weather to access your location', 'Daily Forecast', '24 Hours Forecast', 'Sun', 'Moon', 'Rise', 'Set'];
const vn = ['Cho phép truy cập vào vị trí của bạn', 'Dự báo theo ngày', 'Dự báo thời tiết trong ngày', 'Mặt trời', 'Mặt trăng',  'Mọc', 'Lặn'];

const MainScreen = (props) => {
    const { navigation } = props;
    const { route } = props;
    const { navigate } = navigation;

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    let [currentLocation, setCurrentLocation] = useState({});
    let [isFetched, setIsFetched] = useState(false);
    let [isEmpty, setIsEmpty] = useState(true);

    let [refreshing, setRefreshing] = useState(false);
    let [weatherLocations, setWeatherLocations] = useState([{ location: 'Ha Noi' }]);
    let [weatherDatas, setWeatherDatas] = useState([]);
    let [celUnit, setCelUnit] = useState(true);
    let [locationPermission, setLocationPermission] = useState(route?.params?.permission)
    let [index, setIndex] = useState(0);
    let [preWeather, setPreWeather] = useState([]);
    let [canFetch, setCanFetch] = useState(false);
    let [isEng, setIsEng] = useState(true);
    const ref = useRef(null);

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
        const data = weatherLocations.map(async ({ location }) => {
            let now = new Date();
            fetchForecast({ cityName: location })
                .then((data) => {
                    temp.push({
                        location: location,
                        fetch_time: now.valueOf(),
                        local_time: data?.location?.localtime,
                        imageBackground: (data?.current?.is_day == 1) ? images.image4 : images.image3,
                        aqiData: data?.current?.air_quality,
                        currentData: data?.current,
                        forecastData: data?.forecast?.forecastday,
                    })
                    setCanFetch(true);
                })
        });
        setWeatherDatas(temp);
        storeData('city', temp[0]?.location);

    }

    const handleRefresh = () => {
        setRefreshing(true);
        fetchWeatherDatas()
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
                let now = new Date();
                fetchForecast({ cityName: currentLocation?.position?.lat + ", " + currentLocation?.position?.lng })
                    .then((data) => {
                        temp.unshift({
                            location: currentLocation?.address?.city,
                            fetch_time: now.valueOf(),
                            local_time: data?.location?.localtime,
                            imageBackground: (data?.current?.is_day == 1) ? images.image4 : images.image3,
                            aqiData: data?.current?.air_quality,
                            currentData: data?.current,
                            forecastData: data?.forecast?.forecastday,
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

    const getAsyncData = async () => {
        let locations = await getLocationData('locations');
        if (locations && locations.length > 0) {
            setWeatherLocations(locations)
        }
        await delay(2000)
        setIsFetched(true)
    }

    const getPreWeather = async () => {
        let weathers = await getLocationData('weathers');
        if (weathers && weathers.length > 0) {
            setPreWeather(weathers);
        }
    }

    const getUnit = async () => {
        let unit = await getData('unit');
        if (unit) {
            setCelUnit(unit == 'Celcius');
        }
    }

    const getLanguage = async () => {
        let lang = await getData('language');
        if (lang) {
            console.log(lang)
            setIsEng(lang == 'English');
        }
    }

    const getPermisison = async () => {
        let isPermission = await getData('LocationPermission');
        setLocationPermission(isPermission == "true")
    }

    useEffect(() => {
        if (route?.params?.newWeatherData) {
            setWeatherDatas(route?.params?.newWeatherData);
        }
    }, [route?.params?.newWeatherData])


    useEffect(() => {
        getPreWeather();
        getUnit();
        getLanguage();
    }, [])

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        getAsyncData();
    }, [route?.params?.cityName, route?.params?.toIndex])

    useEffect(() => {
        if (ref.current && route?.params?.toIndex && route?.params?.toIndex < weatherLocations.length) {
            ref.current?.scrollToIndex({
                index: route?.params?.toIndex,
                animated: true
            })
        }
    }, [route?.params?.toIndex])

    useEffect(() => {
        if (route?.params?.unit) {
            getUnit()
        }

    }, [route?.params?.unit])

    useEffect(() => {
        if (route?.params?.language) {
            getLanguage()
        }

    }, [route?.params?.unit])

    useEffect(() => {
        getPermisison();
    }, [route?.params?.permission])

    useEffect(() => {
        fetchWeatherDatas();
    }, [weatherLocations])


    if (isFetched == false) {
        return <HomeView></HomeView>
    }

    // if (isFetched == true && weatherDatas.length == 0) {
    //     return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //         <FontAwesomeIcon icon={faWifi} size={50} color={'#7a7a7a'}></FontAwesomeIcon>
    //         <Text>Check your internet</Text>
    //         <TouchableOpacity style={{width: 80, height: 40, backgroundColor: colors.buttonColor, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
    //             setIsFetched(false);
    //             getAsyncData()
    //         }}>
    //             <Text>Try again</Text>
    //         </TouchableOpacity>
    //     </View>
    // }


    if (isFetched) {
        if (canFetch && weatherDatas.length != 0) {
            storeLocationData('weathers', weatherDatas);
        } else {
            setWeatherDatas(preWeather);
        }
        return (
            <View style={{
                flex: 1, backgroundColor: 'white'
            }}

            >
                <FlatList
                    ref={ref}
                    nestedScrollEnabled
                    data={weatherDatas}
                    pagingEnabled
                    horizontal
                    showsHorizontalScrollIndicator
                    initialScrollIndex={index}
                    renderItem={(weatherDataItem) => {
                        let lang = isEng ? en : vn;
                        let fetch_time = new Date(weatherDataItem?.item?.fetch_time);
                        let fetch_day = fetch_time.getDay();
                        let fetch_hour = fetch_time.getHours();
                        let local_time = new Date(weatherDataItem?.item?.local_time);
                        let local_day = local_time.getDay();
                        let local_hour = local_time.getHours();
                        let now = new Date();
                        let current_day = now.getDay();
                        let current_hour = now.getHours();
                        let i_day = 0;
                        let i_hour = local_hour;
                        let current_weather = weatherDataItem?.item?.currentData;
                        console.log(fetch_hour)
                        if (fetch_day != current_day || fetch_hour != current_hour) {
                            i_day = (current_day - fetch_day);
                            i_hour = (current_hour - fetch_hour);
                            if (i_day < 0) {
                                i_day = i_day + 7;
                            }
                            if (i_day > 6) {
                                i_day = 6;
                            }
                            if (i_day == 0) {
                                if (i_hour != 0) {
                                    i_hour = local_hour + current_hour - fetch_hour;
                                    if (i_hour > 23) {
                                        i_hour = i_hour - 23;
                                        i_day = 1;
                                    }
                                    current_weather = weatherDataItem?.item?.forecastData[i_day]?.hour[i_hour];
                                } else {
                                    i_hour = local_hour;
                                }
                            }
                            if (i_day != 0) {
                                i_hour = local_hour + current_hour + 23 - fetch_hour;
                                if (i_hour > 23) {
                                    i_hour = i_hour - 23;
                                    i_day = (i_day + 1);
                                    if (i_day > 6) {
                                        i_day = 6;
                                    }
                                }
                                current_weather = weatherDataItem?.item?.forecastData[i_day]?.hour[i_hour];
                            }
                        }



                        let current_temperature = current_weather?.temp_c;
                        let max_temperature = Math.round(weatherDataItem?.item?.forecastData[i_day]?.day?.maxtemp_c);
                        let min_temperature = Math.round(weatherDataItem?.item?.forecastData[i_day]?.day?.mintemp_c);
                        let current_weather_condition = current_weather?.condition?.text;
                        let current_icon = images[getWeatherIcon(current_weather?.condition?.icon)];
                        let image_background = weatherDataItem?.item?.imageBackground;

                        let current_extrainfo = [
                            {
                                name: 'Humidity',
                                value: Math.round(current_weather?.humidity) + "%"
                            },
                            {
                                name: 'Pressure',
                                value: Math.round(current_weather?.pressure_mb) + "hPa"
                            },
                            {
                                name: 'UV',
                                value: Math.round(current_weather?.uv)
                            },
                            {
                                name: 'Real feel',
                                value: Math.round(current_weather?.feelslike_c)
                            }
                        ];

                        let brief_forcast = [
                            {
                                date: weatherDataItem?.item?.forecastData[i_day % 7].date,
                                dayOfWeeks: 'Today',
                                highestTemp: Math.round(weatherDataItem?.item?.forecastData[i_day % 7].day.maxtemp_c),
                                lowestTemp: Math.round(weatherDataItem?.item?.forecastData[i_day % 7].day.mintemp_c),
                                weather: weatherDataItem?.item?.forecastData[i_day % 7].day.condition.text,
                                icon: weatherDataItem?.item?.forecastData[i_day % 7].day.condition.icon,
                            },
                            {
                                date: weatherDataItem?.item?.forecastData[(i_day + 1) % 7].date,
                                dayOfWeeks: 'Tomorrow',
                                highestTemp: Math.round(weatherDataItem?.item?.forecastData[(i_day + 1) % 7].day.maxtemp_c),
                                lowestTemp: Math.round(weatherDataItem?.item?.forecastData[(i_day + 1) % 7].day.mintemp_c),
                                weather: weatherDataItem?.item?.forecastData[(i_day + 1) % 7].day.condition.text,
                                icon: weatherDataItem?.item?.forecastData[(i_day + 1) % 7].day.condition.icon,
                            },
                            {
                                date: weatherDataItem?.item?.forecastData[(i_day + 2) % 7].date,
                                dayOfWeeks: getDayOfWeek(weatherDataItem?.item?.forecastData[(i_day + 2) % 7].date),
                                highestTemp: Math.round(weatherDataItem?.item?.forecastData[(i_day + 2) % 7].day.maxtemp_c),
                                lowestTemp: Math.round(weatherDataItem?.item?.forecastData[(i_day + 2) % 7].day.mintemp_c),
                                weather: weatherDataItem?.item?.forecastData[(i_day + 2) % 7].day.condition.text,
                                icon: weatherDataItem?.item?.forecastData[(i_day + 2) % 7].day.condition.icon,
                            },
                        ]

                        if (i_day > 4) {
                            brief_forcast = [
                                {
                                    date: weatherDataItem?.item?.forecastData[4].date,
                                    dayOfWeeks: getDayOfWeek(weatherDataItem?.item?.forecastData[4].date),
                                    highestTemp: Math.round(weatherDataItem?.item?.forecastData[4].day.maxtemp_c),
                                    lowestTemp: Math.round(weatherDataItem?.item?.forecastData[4].day.mintemp_c),
                                    weather: weatherDataItem?.item?.forecastData[4].day.condition.text,
                                    icon: weatherDataItem?.item?.forecastData[4].day.condition.icon,
                                },
                                {
                                    date: weatherDataItem?.item?.forecastData[5].date,
                                    dayOfWeeks: getDayOfWeek(weatherDataItem?.item?.forecastData[5].date),
                                    highestTemp: Math.round(weatherDataItem?.item?.forecastData[5].day.maxtemp_c),
                                    lowestTemp: Math.round(weatherDataItem?.item?.forecastData[5].day.mintemp_c),
                                    weather: weatherDataItem?.item?.forecastData[5].day.condition.text,
                                    icon: weatherDataItem?.item?.forecastData[5].day.condition.icon,
                                },
                                {
                                    date: weatherDataItem?.item?.forecastData[6].date,
                                    dayOfWeeks: getDayOfWeek(weatherDataItem?.item?.forecastData[6].date),
                                    highestTemp: Math.round(weatherDataItem?.item?.forecastData[6].day.maxtemp_c),
                                    lowestTemp: Math.round(weatherDataItem?.item?.forecastData[6].day.mintemp_c),
                                    weather: weatherDataItem?.item?.forecastData[6].day.condition.text,
                                    icon: weatherDataItem?.item?.forecastData[6].day.condition.icon,
                                },
                            ]
                        }

                        if (current_hour != fetch_hour) {
                            image_background = (current_weather?.is_day == 1) ? images.image4 : images.image3;
                        }

                        let is_raining = current_weather?.condition?.text.toLowerCase().includes("rain");

                        console.log(i_hour)


                        return (
                            <View style={{ width: windowWidth }}>

                                {/**------------------------App---------------------------- */}
                                <ImageBackground source={image_background}
                                    style={{ flex: 1 }}
                                    resizeMode='stretch'
                                >

                                    {/*---------Header---------*/}
                                    <View style={{
                                        flex: 1, paddingVertical: 10
                                    }}>

                                        <View style={{
                                            ...commonStyle1,
                                            paddingHorizontal: 20,
                                        }}>
                                            <TouchableOpacity onPress={() => { navigate('LocationScreen', { weatherData: weatherDatas, unit: celUnit, lan: isEng }) }}>
                                                <FontAwesomeIcon
                                                    icon={faPlus}
                                                    size={fontSizes.iconSize}
                                                    color={colors.textColor}
                                                ></FontAwesomeIcon>
                                            </TouchableOpacity>

                                            <Text style={{
                                                fontSize: fontSizes.h4,
                                                color: colors.textColor
                                            }}>{weatherDataItem?.item?.location}</Text>

                                            {/**-------------Setting selection------------------------ */}
                                            <TouchableOpacity onPress={() => navigate("SettingScreen")}>
                                                <FontAwesomeIcon
                                                    icon={faEllipsisV}
                                                    size={fontSizes.iconSize}
                                                    color={colors.textColor}
                                                ></FontAwesomeIcon>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{
                                            flex: 1, alignItems: 'center'
                                        }}>
                                            <SmallButton content={lang[0]}
                                                onPress={() => {
                                                    if (locationPermission) {
                                                        handleAccessLocation()
                                                    } else {
                                                        navigate('LocationPermissionScreen', { permission: locationPermission });
                                                    }
                                                }}
                                            ></SmallButton>

                                            <View style={{
                                                ...commonStyle1,
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
                                        <ScrollView
                                            nestedScrollEnabled
                                            showsVerticalScrollIndicator={false}
                                            contentContainerStyle={{ flexGrow: 1 }}
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
                                                {is_raining && <Rain fullScreen={false} rainCount={20} fallSpeed="slow" />}
                                                <View style={{
                                                    flex: 1,
                                                    marginTop: 40,
                                                }}>
                                                    <BigTemperature
                                                        currentTemp={current_temperature}
                                                        unit={celUnit}
                                                    ></BigTemperature>
                                                </View>

                                                <View style={{
                                                    flex: 1,
                                                }}>
                                                    <View style={{
                                                        ...commonStyle1,
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Text
                                                            style={{
                                                                color: colors.textColor,
                                                                fontSize: fontSizes.h4
                                                            }}
                                                        >
                                                            {current_weather_condition}
                                                        </Text>

                                                        <View style={{ width: 20 }}></View>
                                                        <Temperature
                                                            highest={max_temperature}
                                                            lowest={min_temperature}
                                                            unit={celUnit}
                                                            fontSize={fontSizes.h4}></Temperature>

                                                    </View>

                                                    <View style={{
                                                        flex: 6,
                                                        justifyContent: 'center',
                                                    }}>
                                                        <View style={{
                                                            ...commonStyle1,
                                                            justifyContent: 'space-evenly',
                                                            marginHorizontal: 30,

                                                        }}>
                                                            <SmallButton content={'AQI'} onPress={() => navigate('AqiScreen', { data: weatherDataItem?.item?.aqiData })}></SmallButton>
                                                            <View style={{
                                                                ...commonStyle2,
                                                                paddingHorizontal: 10,
                                                                paddingVertical: 2,
                                                                borderRadius: 15,
                                                                backgroundColor: colors.buttonColor,
                                                            }}>
                                                                <Image source={current_icon} style={{ tintColor: '#ffffff', width: 20, height: 16, justifyContent: 'center' }}></Image>
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
                                                <View style={{
                                                    flex: 1,
                                                    marginHorizontal: 10,
                                                    marginVertical: 20,
                                                    backgroundColor: colors.backgroundColor,
                                                    borderRadius: 20
                                                }}
                                                >
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
                                                            data={brief_forcast}
                                                            renderItem={({ item }) => {
                                                                return <View><WeatherInfoH weatherInfo={item} unit={celUnit}></WeatherInfoH></View>
                                                            }}
                                                            keyExtractor={item => item.date}
                                                        >
                                                        </FlatList>
                                                    </View>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Button
                                                            onPress={() =>
                                                                navigate('UpcomingWeatherScreen', {
                                                                    data: weatherDataItem?.item?.forecastData,
                                                                    background: image_background,
                                                                    unit: celUnit, day: i_day,
                                                                    lan: isEng
                                                                })
                                                            }
                                                            content={lang[1]}></Button>
                                                    </View>
                                                </View>
                                            </View>

                                            {/*------------HourLyForecast------------*/}
                                            <View style={{
                                                backgroundColor: colors.backgroundColor,
                                                height: 250,
                                                margin: 10,
                                                marginTop: 0,
                                                borderRadius: 15,

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
                                                    <Text style={textStyle}>{lang[2]}</Text>
                                                </View>

                                                {/*------------Info------------*/}
                                                <ScrollView nestedScrollEnabled showsHorizontalScrollIndicator={false} horizontal style={{ flex: 1, flexDirection: 'row' }}>
                                                    {weatherDataItem?.item?.forecastData[i_day]?.hour.map((item, index) => {
                                                        return (<WeatherHourlyV
                                                            key={index}
                                                            unit={celUnit}
                                                            max={max_temperature}
                                                            temp={item.temp_c}
                                                            hour={item.time}
                                                            icon={item.condition.icon}
                                                            now={i_hour == index}
                                                        >
                                                        </WeatherHourlyV>)
                                                    })}

                                                </ScrollView>
                                            </View>

                                            {/*------------Extra Information------------*/}
                                            <View style={{
                                                height: 200,
                                                marginHorizontal: 5,
                                                flexDirection: 'row'
                                            }}>
                                                {/*------------RiseSetTime------------*/}
                                                <View style={{
                                                    flex: 1,
                                                }}>
                                                    <View style={{
                                                        flex: 1,
                                                        backgroundColor: colors.backgroundColor,
                                                        margin: 5,
                                                        borderRadius: 10
                                                    }}>
                                                        <View style={{ marginHorizontal: 5, marginTop: 2, justifyContent: 'space-start', alignItems: 'center', flexDirection: 'row' }}>
                                                            <Text style={{ ...textStyle, fontSize: fontSizes.h7, color: colors.fadeTextColor }}>{lang[3]}</Text>
                                                        </View>
                                                        <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                                <Text style={textStyle}>{weatherDataItem?.item?.forecastData[0].astro.sunrise}</Text>
                                                                <Text style={{ ...textStyle, fontSize: fontSizes.h6, color: colors.fadeTextColor }}>{lang[5]}</Text>
                                                            </View>
                                                            <View style={{ height: 1, backgroundColor: colors.fadeTextColor, marginHorizontal: 20 }}></View>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                                <Text style={textStyle}>{weatherDataItem?.item?.forecastData[0].astro.sunset}</Text>
                                                                <Text style={{ ...textStyle, fontSize: fontSizes.h6, color: colors.fadeTextColor }}>{lang[6]}</Text>
                                                            </View>
                                                            <View style={{ marginHorizontal: 5, marginBottom: 5, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
                                                            <FontAwesomeIcon icon={faSun} color={'white'} size={10}></FontAwesomeIcon>
                                                        </View>
                                                            
                                                        </View>
                                                        

                                                    </View>

                                                    <View style={{
                                                        flex: 1,
                                                        backgroundColor: colors.backgroundColor,
                                                        margin: 5,
                                                        borderRadius: 10,
                                                    }}>
                                                        <View style={{ marginHorizontal: 5, marginTop: 2, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                                                            <Text style={{ ...textStyle, fontSize: fontSizes.h7, color: colors.fadeTextColor }}>{lang[4]}</Text>
                                                        </View>
                                                        <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                                <Text style={textStyle}>{weatherDataItem?.item?.forecastData[0].astro.moonrise}</Text>
                                                                <Text style={{ ...textStyle, fontSize: fontSizes.h6, color: colors.fadeTextColor }}>{lang[5]}</Text>
                                                            </View>
                                                            <View style={{ height: 1, backgroundColor: colors.fadeTextColor, marginHorizontal: 20 }}></View>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                                <Text style={textStyle}>{weatherDataItem?.item?.forecastData[0].astro.moonset}</Text>
                                                                <Text style={{ ...textStyle, fontSize: fontSizes.h6, color: colors.fadeTextColor }}>{lang[6]}</Text>
                                                            </View>
                                                            <View style={{ marginHorizontal: 5, marginBottom: 5, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
                                                            <FontAwesomeIcon icon={faMoon} color={'white'} size={10}></FontAwesomeIcon>
                                                        </View>
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
                                                        data={current_extrainfo}
                                                        renderItem={({ item }) => {
                                                            if (!celUnit) {
                                                                if (item.name == 'Real feel') {
                                                                    item.value = cToF(item.value)
                                                                }
                                                            }
                                                            return <ExtraInfoItem data={item} height={28} nameStyle={textStyle} valueStyle={valueTextStyle}></ExtraInfoItem>
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
const valueTextStyle = StyleSheet.create({
    color: colors.fadeTextColor, fontSize: fontSizes.h6, textAlignVertical: 'center'
})

const commonStyle2 = StyleSheet.create({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
})

const commonStyle1 = StyleSheet.create({
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
})
export default MainScreen;