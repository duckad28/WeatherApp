import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    Text,
    TextInput,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faPlus, faSearch, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { LocationItem } from '../components';
import { colors } from '../constants';
import { fetchSuggestLocation, fetchForecast } from '../repositories/fetchData';
import { debounce } from 'lodash';
import { storeLocationData, getLocationData } from '../utilities/locationStorage';
import { storeData, getData } from '../utilities/asyncStorage';
import { images } from '../constants/index'

const en = ['Manage places', 'Enter location', 'Cancel'];
const vn = ['Quản lý địa điểm', 'Nhập vị trí', 'Hủy']
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const LocationScreen = (props) => {
    const { navigation } = props;
    const { navigate } = navigation;
    const { route } = props;

    let [lan, setLan] = useState(route?.params?.lan ? en : vn);

    let [searchText, setSearchText] = useState('');
    let [searching, setSearching] = useState(false);
    let [locationData, setLocationData] = useState([{ location: 'Ha Noi' }]);
    let [weatherData, setWeatherData] = useState([]);
    let [suggestLocations, setSuggestLocations] = useState([]);
    let [isChange, setIsChange] = useState(0);

    const handlePress = () => {
        if (isChange > 0) {
            navigate('MainScreen', { newLocations: locationData, newWeatherData: weatherData })
        } else {
            navigate('MainScreen')
        }
    }

    const handleRemoveLocation = (item) => {
        let newWeatherData = weatherData.filter(remainItem => remainItem !== item);
        if (newWeatherData) {
            let newLocationData = weatherData.map((item) => {
                return {
                    location: item?.location
                }
            })
            if (newLocationData) {
                storeLocationData('locations', newLocationData);
                setWeatherData(newWeatherData);
                setLocationData(newLocationData);
                setIsChange(++isChange);
            }
            
        }
    }

    const fetchNewLocation = (loc) => {
        const temp = [...weatherData];
        let now = new Date();
        fetchForecast({ cityName: loc?.name })
            .then((data) => {
                temp.push({
                    location: loc?.name,
                    fetch_time: now.valueOf(),
                    local_time: data?.location?.localtime,
                    imageBackground: (data?.current?.is_day == 1) ? images.image4 : images.image3,
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
            if (!locationData.some(e => e.location === loc?.name)) {
                let temp = [...locationData, { location: loc?.name }];
                if (temp) {
                    fetchNewLocation(loc);
                    storeLocationData('locations', temp)
                    setLocationData(temp);
                    setIsChange(++isChange);
                    await delay(800);
                    setSearching(!searching);
                }
            }
            else {
                setSearching(!searching);
            }
        }
    }

    const handleSearch = (text) => {
        setSearchText(text);
        if (text.length > 2) {
            fetchSuggestLocation({ cityName: text })
                .then(data => {
                    setSuggestLocations(data);
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }


    const handleTextDebounce = useCallback(debounce(handleSearch, 300), [])

    useEffect(() => {
        if (route?.params?.weatherData) {
            setLocationData(route?.params?.weatherData.map((item) => {
                return { location: item?.location }
            }))
            setWeatherData(route?.params?.weatherData);
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
                            onChangeText={(text) => {
                                setSearchText(text)
                            }}
                            onSubmitEditing={() => {
                                if (searchText) {
                                    storeData('city', searchText);
                                }

                                if (isChange > 0) {
                                    navigate('MainScreen', { cityName: searchText })
                                }
                            }}
                            placeholder={lan[1]}
                            style={{}}
                        ></TextInput>
                    </View>



                    <View style={{ flex: 12, margin: 20 }}>
                        {/* .filter((eachLocation) => {
                            return eachLocation?.location?.toLowerCase()?.includes(searchText.toLowerCase())
                        }) */}
                        <FlatList data={weatherData}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <LocationItem eachLocation={item} unit={route?.params?.unit} onPress={() => {
                                            storeData('city', item.location);
                                            if (isChange > 0) {
                                                navigate('MainScreen', { toIndex: index, newWeatherData: weatherData });
                                            } else {
                                                navigate('MainScreen', { toIndex: index });
                                            }
                                        }}>
                                        </LocationItem>

                                        <TouchableOpacity
                                            onPress={() => { handleRemoveLocation(item) }}>
                                            <FontAwesomeIcon
                                                icon={faMinusCircle}
                                                size={25}
                                                style={{ tintColor: 'black' }}
                                            >
                                            </FontAwesomeIcon>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.location}>
                        </FlatList>
                    </View>
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
                <TouchableOpacity onPress={() => setSearching(!searching)}
                    style={{
                        marginTop: 20,
                        alignItems: 'center', height: 50, justifyContent: 'center'
                    }}
                >
                    <Text>{lan[2]}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ height: 10 }}></View>
            <View style={{ flex: 1, margin: 20, flexDirection: 'row', justifyContent: 'center' }}>
                {
                    suggestLocations.length > 0 && searching ? (
                        <View>
                            {
                                suggestLocations.map((loc, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={{
                                                height: 40,
                                                width: '90%',
                                                margin: 5,
                                                padding: 10,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                borderRadius: 10,
                                                backgroundColor: colors.backgroundColor
                                            }}
                                            onPress={() => {
                                                handleAddLocation(loc)
                                            }}
                                        >
                                            <Text>{loc?.name}, {loc?.country}</Text>
                                            <FontAwesomeIcon icon={faPlus} size={15}></FontAwesomeIcon>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    ) : null
                }
            </View>
        </View>
    }
}

export default LocationScreen;