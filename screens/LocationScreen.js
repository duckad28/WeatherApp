import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    Text,
    TextInput,
    BackHandler,
    Image, StyleSheet
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faPlus, faSearch, faMinusCircle, faWifi, faTrashCan, faCheck, faLocation } from '@fortawesome/free-solid-svg-icons';
import { LocationItem } from '../components';
import { colors } from '../constants';
import { fetchSuggestLocation, fetchForecast } from '../repositories/fetchData';
import { debounce } from 'lodash';
import { storeLocationData, getLocationData } from '../utilities/locationStorage';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { storeData, getData } from '../utilities/asyncStorage';
import { images, fontSizes } from '../constants/index'
import { getWeatherIcon, getDayOfWeek, cToF } from '../utilities';
import NetInfo from "@react-native-community/netinfo";

const en = ['Manage places', 'Enter location', 'Cancel'];
const vn = ['Quản lý địa điểm', 'Nhập vị trí', 'Hủy']
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const LocationScreen = (props) => {
    const { navigation } = props;
    const { navigate } = navigation;
    const { route } = props;

    let [lan, setLan] = useState(route?.params?.lang ? en : vn);

    let [searchText, setSearchText] = useState('');
    let [searching, setSearching] = useState(false);
    let [weatherData, setWeatherData] = useState([]);
    let [suggestLocations, setSuggestLocations] = useState([]);
    let [searchLocation, setSearchLocation] = useState({});
    let [isChange, setIsChange] = useState(0);
    let [internet, setInternet] = useState(true);

    const handlePress = () => {

        if (weatherData.length == 0) {
            BackHandler.exitApp();
        }
        if (isChange > 0) {
            navigate('MainScreen', {newWeatherData: weatherData, lang: route?.params?.lang, unit: route?.params?.unit });
        } else {
            navigate('MainScreen', { lang: route?.params?.lang, unit: route?.params?.unit })
        }
    }

    const handleRemoveLocation = (item) => {
        let newWeatherData = weatherData.filter(remainItem => remainItem !== item);
        if (newWeatherData.length == 0) {
            storeLocationData('weathers', []);
            setWeatherData([]);
            setIsChange(++isChange);
        } else {
                storeLocationData('weathers', newWeatherData);
                setWeatherData(newWeatherData);
                setIsChange(++isChange);
        }

    }

    const fetchNewLocation = (loc) => {
        const temp = [...weatherData];
        let now = new Date();
        fetchForecast({ cityName: loc?.name })
            .then((data) => {
                temp.push({
                    location: data?.location?.name,
                    country: data?.location?.country,
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
        setWeatherData(temp)
    }
    const handleAddLocation = async (loc) => {
        if (loc) {
            if (!weatherData.some(e => (e?.location == loc?.name && e?.country == loc?.country))) {
                if (searchLocation?.location == loc?.name && loc?.country == searchLocation?.coutry) {
                    let temp = [...weatherData, searchLocation];
                    setWeatherData(temp);
                    setIsChange(++isChange);
                } else {
                    fetchNewLocation(loc);
                    setIsChange(++isChange);
                    await delay(1500);
                }
            }
        }
    }

    const fetchLoc = (loc) => {
        let now = new Date();
        fetchForecast({ cityName: loc?.name })
            .then((data) => {
                setSearchLocation({
                    location: data?.location?.name,
                    country: data?.location?.country,
                    curloc: false,
                    fetch_time: now.valueOf(),
                    local_time: data?.location?.localtime,
                    imageBackground: (data?.current?.is_day == 1) ? images.image7 : images.image8,
                    aqiData: data?.current?.air_quality,
                    currentData: data?.current,
                    forecastData: data?.forecast?.forecastday,
                })
                console.log(loc?.name)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleSearch = (text) => {
        setSearchText(text);
        if (text && text.length > 2) {
            if (Platform.OS === "android") {
                NetInfo.fetch().then(({ isConnected }) => {
                    if (isConnected) {
                        setInternet(true);
                        fetchSuggestLocation({ cityName: text })
                            .then(data => {
                                setSuggestLocations(data);
                                fetchLoc(data[0])
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    } else {
                        setInternet(false);
                    }
                });
            }

        }
    }


    const handleTextDebounce = useCallback(debounce(handleSearch, 300), [])

    useEffect(() => {
        if (route?.params?.weatherData) {
            setWeatherData(route?.params?.weatherData);
        } else {
            setSearching(true);
        }
    }, [route?.params?.weatherData])




    if (searching == false) {
        return (
            <View style={{
                backgroundColor: 'white',
                flex: 1
            }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'white',
                        marginHorizontal: 10,
                        marginVertical: 10
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            handlePress()
                        }}
                        style={{ height: 40 }}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} size={26}></FontAwesomeIcon>
                    </TouchableOpacity>
                    <View style={{ marginHorizontal: 20, height: 80, justifyContent: 'center' }}>
                        <Text
                            style={{
                                fontSize: 30,
                                color: 'black',
                                textAlignVertical: 'center'
                            }}
                        >
                            {lan[0]}
                        </Text>
                    </View>

                    <View style={{
                        height: 50,
                        borderRadius: 30,
                        backgroundColor: colors.backgroundColor,
                        flexDirection: 'row',
                        marginHorizontal: 20,
                        marginTop: 20,
                        alignItems: 'center'
                    }}>
                        <FontAwesomeIcon icon={faSearch} size={18} style={{ paddingHorizontal: 20 }}></FontAwesomeIcon>
                        <TextInput
                            onFocus={() => setSearching(!searching)}
                            placeholder={lan[1]}
                            style={{}}
                        ></TextInput>
                    </View>



                    <GestureHandlerRootView style={{ flex: 12, margin: 20 }}>
                        <FlatList data={weatherData}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                let curloc = item?.curloc;
                                const rightSwipe = () => {
                                    return (
                                        !curloc && <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000020', marginVertical: 20, marginHorizontal: 5, paddingHorizontal: 10, borderRadius: 10 }}>
                                            <TouchableOpacity
                                                onPress={() => { handleRemoveLocation(item) }}>
                                                <FontAwesomeIcon
                                                    icon={faTrashCan}
                                                    size={25}
                                                    style={{ tintColor: 'black' }}
                                                >
                                                </FontAwesomeIcon>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                                return (
                                    <Swipeable renderRightActions={rightSwipe}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <LocationItem eachLocation={item} unit={route?.params?.unit}
                                            onPress={() => {
                                                if (isChange > 0) {
                                                    navigate('MainScreen', { toIndex: index, newWeatherData: weatherData, lang: route?.params?.lang, unit: route?.params?.unit });
                                                } else {
                                                    navigate('MainScreen', { toIndex: index, lang: route?.params?.lang, unit: route?.params?.unit });
                                                }
                                            }}>
                                            </LocationItem>

                                        </View>
                                    </Swipeable>
                                )
                            }}
                            keyExtractor={item => item.location}>
                        </FlatList>
                    </GestureHandlerRootView>
                </View>
            </View>
        )
    }



    if (searching) {
        return <View style={{
            backgroundColor: 'white',
            flex: 1
        }}>
            <View
                style={{
                    height: 80,
                    backgroundColor: 'white',
                    marginHorizontal: 10,
                    marginVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}
            >
                <View style={{
                    height: 50,
                    borderRadius: 30,
                    backgroundColor: colors.backgroundColor,
                    flexDirection: 'row',
                    marginHorizontal: 20,
                    marginTop: 20,
                    alignItems: 'center',
                    flex: 1
                }}>
                    <FontAwesomeIcon icon={faSearch} size={18} style={{ paddingHorizontal: 20 }}></FontAwesomeIcon>
                    <TextInput
                        onChangeText={handleTextDebounce}
                        onSubmitEditing={() => {
                            handleSearch(searchText);
                        }} placeholder={lan[1]} style={{}}></TextInput>

                </View>
                <TouchableOpacity onPress={() => {
                    setSearching(!searching);
                    setSuggestLocations([]);
                }
                }
                    style={{
                        marginTop: 20,
                        alignItems: 'center', height: 50, justifyContent: 'center'
                    }}
                >
                    <Text style={{fontWeight: '900'}}>{lan[2]}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ height: 10 }}></View>
            <View style={{ flex: 1, margin: 20, flexDirection: 'row', justifyContent: 'center' }}>
                {
                    suggestLocations.length > 0 && searching && searchLocation ? (
                        <View>
                            {
                                suggestLocations.map((loc, index) => {
                                    let added = weatherData.some(e => (e?.location === loc?.name && e?.country === loc?.country));
                                    return (
                                        <View key ={index} style={{padding: 10}}>
                                            <TouchableOpacity
                                                key={index}
                                                style={{
                                                    height: 90,
                                                    width: '90%',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    
                                                }}
                                                onPress={() => {
                                                    handleAddLocation(loc)
                                                }}
                                            >
                                                <View style={{flex: 1, justifyContent: 'flex-start'}}>
                                                    <Text style={{ fontSize: fontSizes.h5, color: 'black' }}>{loc?.name}</Text>
                                                    <Text style={{ fontSize: fontSizes.h6 }}>{loc?.country}</Text>
                                                </View>
                                                
                                                {added ? <FontAwesomeIcon icon={faCheck} size={15}></FontAwesomeIcon> : <FontAwesomeIcon icon={faPlus} size={15}></FontAwesomeIcon>}
                                            </TouchableOpacity>
                                            {loc?.name == searchLocation?.location && loc?.country == searchLocation?.country && (
                                                <View>
                                                    <FlatList
                                                        data={searchLocation?.forecastData}
                                                        horizontal
                                                        showsHorizontalScrollIndicator={false}
                                                        renderItem={({ item }) => {
                                                            return <WeatherInfoV weatherInfo={item} unit={route?.params?.unit} lang={route?.params?.lang}></WeatherInfoV>

                                                        }}
                                                        keyExtractor={(item, index) => index}>

                                                    </FlatList>
                                                </View>
                                            )}
                                        </View>
                                    )
                                })
                            }
                        </View>
                    ) : null
                }
                {
                    !internet ? (
                        <View style={{ height: 300, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                            <FontAwesomeIcon icon={faWifi} size={50}></FontAwesomeIcon>
                            <Text>Couldn't connect to the network, try again</Text>
                            <TouchableOpacity
                                style={{
                                    height: 40,
                                    width: 120,
                                    backgroundColor: colors.buttonColor,
                                    borderRadius: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress={() => {
                                    handleSearch(searchText);
                                }}
                            >
                                <Text>Try again</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
            </View>
        </View>
    }
}

const WeatherInfoV = (props) => {
    let { day, date } = props.weatherInfo;
    let { unit, lang } = props;
    let dayOfWeeks = getDayOfWeek(date);
    let highestTemp = Math.round(day?.maxtemp_c);
    let lowestTemp = Math.round(day?.mintemp_c);
    return (
        <View style={{
            flexDirection: 'column', borderWidth: 1, borderColor: colors.borderColor,
            height: 140, width: 50, marginHorizontal: 2, paddingTop: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 10
        }}>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ ...textStyle, fontSize: fontSizes.h6 }}>{dayOfWeeks}</Text>
            </View>

            <Image source={images[getWeatherIcon(day?.condition?.icon)]} style={{ tintColor: '#000000', width: 20, height: 16, justifyContent: 'center' }}></Image>

            <View style={{
                flexDirection: 'column', height: 50, justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Text style={textStyle}>{unit ? highestTemp : cToF(highestTemp)}°</Text>
                <Text style={textStyle}>{unit ? lowestTemp : cToF(lowestTemp)}°</Text>
            </View>
        </View>
    )
}

const textStyle = StyleSheet.create({
    color: colors.blackTextColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})


export default LocationScreen;