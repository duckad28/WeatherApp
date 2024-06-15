import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    ActivityIndicator,
    RefreshControl,
    Animated,
    Dimensions,
    LogBox,
    NativeModules,
    Platform, Easing
} from 'react-native';

import {
    SmallButton,
    BigTemperature,
    Temperature,
    WeatherInfoH,
    Button,
    WeatherHourlyV,
    ExtraInfoItem, 
    Rain,
    Snow 
} from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import LottieView from 'lottie-react-native';

import { faCircle, faClock, faEllipsisV, faLocationArrow, faMoon, faPlus, faSun, faWifi } from '@fortawesome/free-solid-svg-icons';
import { images, colors, fontSizes, viText } from '../constants';
import { getDayOfWeek, getWeatherIcon, cToF } from '../utilities';

import SharedGroupPreferences from 'react-native-shared-group-preferences';
import GeoLocation from "@react-native-community/geolocation";
import { fetchForecast, fetchGeo } from '../repositories/fetchData';
import { debounce, size } from 'lodash';
import { getLocationData, storeLocationData } from '../utilities/locationStorage';
import { getData, storeData } from '../utilities/asyncStorage';
import NetInfo from "@react-native-community/netinfo";
import PushNotification from "react-native-push-notification";
import BackgroundService from 'react-native-background-actions';
import TextTicker from 'react-native-text-ticker';


const en = ['Allow Weather to access your location', 'Daily Forecast', '24 Hours Forecast', 'Sun', 'Moon', 'Rise', 'Set', 'Humidity', 'Pressure', 'Real feel', 'Today', 'Tomorrow'];
const vn = ['Cho phép truy cập vào vị trí của bạn', 'Dự báo theo ngày', 'Dự báo thời tiết trong ngày', 'Mặt trời', 'Mặt trăng',  'Mọc', 'Lặn', 'Độ ẩm', 'Áp suất', 'Cảm nhận', 'Hôm nay', 'Ngày mai'];
const SharedWidget = NativeModules.SharedWidget;

const MainScreen = (props) => {
    const { navigation } = props;
    const { route } = props;
    const { navigate } = navigation;

    // Kích thước
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    // Các dữ liệu khởi tạo
    let [isFetched, setIsFetched] = useState(false);
    

    // Các dữ liệu
    let [weatherDatas, setWeatherDatas] = useState([]);
    let [preWeather, setPreWeather] = useState([]);
    
    // Các thông tin chung
    let [index, setIndex] = useState(0);
    let [isE, setIsE] = useState(true);
    let [isC, setIsC] = useState(true);

    // Vị trí hiện tại
    let [currentLocation, setCurrentLocation] = useState(null);
    let [locationPermission, setLocationPermission] = useState(route?.params?.permission);
    
    // Location list
    const ref = useRef(null);

    let [internet, setInternet] = useState(false);

    const CheckConnectivity = () => {
        // For Android devices
        if (Platform.OS === "android") {
          NetInfo.fetch().then(({isConnected}) => {
            if (isConnected) {
                setInternet(true);
            } else {
                setInternet(false)
            }
          });
        }
    };

    // Check internet

    // Long text animatino


    //Lay dia chi chi tiet tu toa do
    const reverseGeoCode = async ({ lat, long }) => {
        let weathers = await getLocationData('weathers');
        fetchGeo({ lat: lat, long: long })
            .then(data => {
                let temp = data?.items[0];
                if (weathers) {
                    if (weathers.some(item => (item?.location == temp?.address?.city))) {
                    } else {
                        let now = new Date(weathers[0]?.fetch_time);
                        fetchForecast({cityName: temp?.address?.city})
                            .then((data) => {
                                weathers.unshift({
                                    location: data?.location?.name,
                                    country: data?.location?.country,
                                    curloc: true,
                                    fetch_time: now.valueOf(),
                                    local_time: data?.location?.localtime,
                                    imageBackground: (data?.current?.is_day == 1) ? images.image7 : images.image8,
                                    aqiData: data?.current?.air_quality,
                                    currentData: data?.current,
                                    forecastData: data?.forecast?.forecastday,
                                })
                                return weathers;
                            })
                            .then((data) => {
                                setWeatherDatas(data);
                                storeLocationData('weathers', data);
                                storeLocationData('CurrentLocation', data[0]);
                                setCurrentLocation(data[0]);
                            })
                    }
                }
            }
        )
    };

    // Lấy dữ liệu từ API
    const fetchWeatherDatas = (locations) => {
        const temp = [];
        const data = locations.map(async ({ location }) => {
            let curloc = await getLocationData('CurrentLocation');
            let now = new Date();
            fetchForecast({ cityName: location })
                .then((data) => {
                    temp.push({
                        location: data?.location?.name,
                        country: data?.location?.country,
                        curloc: data?.location?.name == curloc?.location,
                        fetch_time: now.valueOf(),
                        local_time: data?.location?.localtime,
                        imageBackground: (data?.current?.is_day == 1) ? images.image7 : images.image8,
                        aqiData: data?.current?.air_quality,
                        currentData: data?.current,
                        forecastData: data?.forecast?.forecastday,
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        });
        setWeatherDatas(temp);
    }

    // Xử lý refresh
    const handleRefresh = () => {
        if (internet) {
            fetchWeatherDatas(weatherDatas);
        }
    }

    // Xử lý khi truy cập địa chỉ hiện tại
    const handleAccessLocation = () => {
        GeoLocation.getCurrentPosition(position => {
            if (position.coords) {
                reverseGeoCode({lat: position?.coords?.latitude, long: position?.coords?.longitude})
            }
        },
        error => console.log(error),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},)
    }

    const handleSendWg = async (text) => {
        SharedWidget.set(JSON.stringify({text}));
        console.log(JSON.stringify({text}));
    };

    // Khởi tạo app
    const startApp = async () => {
        await delay(2000)
        setIsFetched(true)
    }

    // Lấy các địa điểm được lưu sẵn
    const getAsyncData = async () => {
        let curloc = await getLocationData('CurrentLocation');
        if (curloc) {
            setCurrentLocation(curloc);
        }
        let weathers = await getLocationData('weathers');
            if(!weathers || weathers.length == 0) {
                await delay(2000);
                navigate('LocationScreen', {lang: isE, unit: isC});
            }
            else {
            if (Platform.OS === "android") {
                NetInfo.fetch().then(({isConnected}) => {
                  if (isConnected) {
                      setInternet(true);
                      fetchWeatherDatas(weathers);
                  } else {
                      setInternet(false);
                  }
                });
              }
            }
    }

    // Lấy dữ liệu các địa điểm được lưu
    const getPreWeather = async () => {
        let weathers = await getLocationData('weathers');
        if (weathers && weathers.length > 0) {
            setPreWeather(weathers);
            setWeatherDatas(weathers);
        }
    }

    // Kiểm tra quền truy cập địa chỉ
    const getPermission = async () => {
        let isPermission = await getData('LocationPermission');
        let curloc = await getLocationData('CurrentLocation');
        setLocationPermission(isPermission == "true");
        if (isPermission == "true" && weatherDatas && weatherDatas.length !=0 && !curloc) {
            handleAccessLocation();
        } 
        
    }

    const getGeneral = async () => {
        let lang = await getData('language');
        let unit = await getData('unit');
        if (lang) {
            setIsE(lang == 'English');
        }
        if (unit) {
            setIsC(unit == 'Celcius');
        }
    }

    useEffect(() => {
        if (route?.params?.newWeatherData) {
            storeLocationData('weathers', route?.params?.newWeatherData);
            setWeatherDatas(route?.params?.newWeatherData);
        }
    }, [route?.params?.newWeatherData])

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        getGeneral();
        getPreWeather();
        startApp();
        getAsyncData();
    }, [])

    useEffect(() => {
        if (ref.current && route?.params?.toIndex != undefined && route?.params?.toIndex < weatherDatas.length) {
            ref.current?.scrollToIndex({
                index: route?.params?.toIndex,
                animated: false
            })
        }
    }, [route?.params?.toIndex])

    // General
    useEffect(() => {
        setIsC(route?.params?.unit);
        setIsE(route?.params?.lang);
    }, [route?.params?.unit, route?.params?.lang])

    useEffect(() => {
        getPermission();
    }, [route?.params?.permission])

    if (isFetched == false) {
        return <HomeView></HomeView>
    }

    if (isFetched) {
        if (internet) {
            if (weatherDatas) {
                if (currentLocation) {
                    let t = weatherDatas.filter(item => item.curloc);
                    let text = t[0]?.location;
                    storeLocationData('noti', t[0]);
                    handleSendWg(text);
                }
                else {
                    let text = weatherDatas[0]?.location;
                let obj = {
                    city: 'Ha Noi',
                    lang: isE,
                    unit: isC
                }
                if (text) {
                    handleSendWg(text);
                }
                storeLocationData('noti', weatherDatas[0]);
                }
                
                
            }
            
        }
        return (
            <View 
                style={{
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
                        let lang = isE ? en : vn;
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
                        current_weather_condition = isE ? current_weather_condition : viText[current_weather_condition.trim().toLowerCase()];
                        let text_length = current_weather_condition.length;
                        let isLongText = (text_length > 16);
                        let current_icon = images[getWeatherIcon(current_weather?.condition?.icon)];
                        let image_background = weatherDataItem?.item?.imageBackground;

                        let current_extrainfo = [
                            {
                                name: lang[7],
                                value: Math.round(current_weather?.humidity) + "%"
                            },
                            {
                                name: lang[8],
                                value: Math.round(current_weather?.pressure_mb) + "hPa"
                            },
                            {
                                name: 'UV',
                                value: Math.round(current_weather?.uv)
                            },
                            {
                                name: lang[9],
                                value: (isC ? Math.round(current_weather?.feelslike_c) : cToF(current_weather?.feelslike_c)) + "°"
                            }
                        ];

                        let brief_forcast = [
                            {
                                date: weatherDataItem?.item?.forecastData[i_day % 7].date,
                                dayOfWeeks: lang[10],
                                highestTemp: Math.round(weatherDataItem?.item?.forecastData[i_day % 7].day.maxtemp_c),
                                lowestTemp: Math.round(weatherDataItem?.item?.forecastData[i_day % 7].day.mintemp_c),
                                weather: weatherDataItem?.item?.forecastData[i_day % 7].day.condition.text,
                                icon: weatherDataItem?.item?.forecastData[i_day % 7].day.condition.icon,
                            },
                            {
                                date: weatherDataItem?.item?.forecastData[(i_day + 1) % 7].date,
                                dayOfWeeks: lang[11],
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
                        
                        let is_raining = false;
                        let temp_var = current_weather?.condition?.text.toLowerCase();
                        let temp_var2 = (current_weather?.is_day == 1);
                        if (temp_var.includes("rain")) {
                            is_raining = true;
                            image_background = images.image11;
                            if (!temp_var2) {
                                image_background = images.image9;
                            }
                        } else if (temp_var.includes("overcast")) {
                            if (temp_var2) {
                                image_background = images.image10;
                            }
                            
                        } else if (temp_var.includes("cloudy")) {
                            if (temp_var2) {
                                image_background = images.image4;
                            }                
                        }
                        let is_snowing = false;
                        if (current_weather?.condition?.text.toLowerCase().includes("snow")) {
                            is_raining = false;
                            is_snowing = true;
                        }
                        return (
                            <View style={{ width: windowWidth }}>

                                {/**------------------------App---------------------------- */}
                                <ImageBackground source={image_background}
                                    style={{ flex: 1 }}
                                    resizeMode='cover'
                                >

                                    {/*---------Header---------*/}
                                    <View style={{
                                        flex: 1, paddingVertical: 10
                                    }}>

                                        <View style={{
                                            ...commonStyle1,
                                            paddingHorizontal: 20,
                                        }}>
                                            <TouchableOpacity onPress={() => { navigate('LocationScreen', { weatherData: weatherDatas, unit: isC, lang: isE }) }}>
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
                                            <TouchableOpacity onPress={() => navigate("SettingScreen", {lang: isE, unit: isC})}>
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
                                            {locationPermission && currentLocation ? <View style={{height: 5}}></View> : <SmallButton content={lang[0]}
                                                onPress={() => {
                                                    navigate('LocationPermissionScreen', { permission: locationPermission, lang: isE, unit: isC });
                                                }}
                                            ></SmallButton>}

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
                                                <RefreshControl onRefresh={handleRefresh} />
                                            }
                                        >
                                            {/*------------Current Temperature.------------*/}
                                            <View style={{
                                                height: 400
                                            }}>
                                                {is_raining && <Rain fullScreen={false} rainCount={20} fallSpeed="slow" />}
                                                {is_snowing && <Snow fullScreen={false} rainCount={20} fallSpeed="slow" />}
                                                <View style={{
                                                    flex: 1,
                                                    marginTop: 40,
                                                }}>
                                                    <BigTemperature
                                                        currentTemp={current_temperature}
                                                        unit={isC}
                                                    ></BigTemperature>
                                                </View>

                                                <View style={{
                                                    flex: 1,
                                                }}>
                                                    <View style={{
                                                        ...commonStyle1,
                                                        justifyContent: 'center'
                                                    }}>
                                                        {isLongText ? <TextTicker scrollSpeed={isLongText ? 40 : 0} loop={true} numberOfLines={1} style={{
                                                                color: colors.textColor,
                                                                fontSize: fontSizes.h4,
                                                                width: 120
                                                            }}>
                                                        {current_weather_condition}
                                                        </TextTicker>
                                                        : <Text numberOfLines={1} style={{
                                                            color: colors.textColor,
                                                            fontSize: fontSizes.h4,
                                                            width: 140
                                                        }}>
                                                            {current_weather_condition}
                                                            </Text>}
                                                        <View style={{ width: 20 }}></View>
                                                        <Temperature
                                                            highest={max_temperature}
                                                            lowest={min_temperature}
                                                            unit={isC}
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
                                                            <SmallButton content={'AQI'} onPress={() => navigate('AqiScreen', { data: weatherDataItem?.item?.aqiData,unit: isC, lang: isE, imageBackground: image_background })}></SmallButton>
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
                                                                return <View><WeatherInfoH weatherInfo={item} unit={isC} lan={isE}></WeatherInfoH></View>
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
                                                                    unit: isC, day: i_day,
                                                                    lang: isE
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
                                                    alignItems: 'center',
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
                                                            unit={isC}
                                                            max={max_temperature}
                                                            temp={item.temp_c}
                                                            hour={item.time}
                                                            icon={item.condition.icon}
                                                            now={i_hour == index}
                                                            lang={isE}
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
                                                            if (!isC) {
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