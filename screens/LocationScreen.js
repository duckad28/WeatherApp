import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    Text,
    TextInput,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCross, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { LocationItem } from '../components';
import { colors } from '../constants';
import { fetchSuggestLocation } from '../repositories/fetchData';
import {debounce} from 'lodash';

const LocationScreen = (props) => {
    const { navigation } = props;
    const { navigate } = navigation;
    const [searchText, setSearchText] = useState('');
    let [searching, setSearching] = useState(false);
    const [locationData, setLocationData] = useState([{
        location: "Ha Noi",
        isSelected: true
    }, {location: 'Hai Duong', isSelected: false}, {location : 'Hai Phong', isSelected: false}
    ])
    
    const [locations, setLocations] = useState([])
    const handleLocation = (loc) => {
        locationData.push({
            location: loc?.name,
            isSelected: false
        })
        setLocationData(locationData)
        setSearching(!searching)
    }
    const handleSearch = (text) => {
        setSearchText(text);
        if (text.length > 2) {
            fetchSuggestLocation({cityName: text}).then (data => {
                setLocations(data);
            })
        }
        
    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])
    if (searching == false) {
        return (
            <View style={{
                backgroundColor: 'white',
                flex: 1
            }}>
                <View
                    style={{ flex: 1, backgroundColor: 'white', marginHorizontal: 10, marginVertical: 10 }}>
                    <TouchableOpacity onPress={() => navigate('MainScreen')} style={{ height: 40 }}>
                        <FontAwesomeIcon icon={faArrowLeft} size={26}></FontAwesomeIcon>
                    </TouchableOpacity>
                    <View style={{ marginHorizontal: 20, height: 80, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 30, color: 'black', textAlignVertical: 'center' }}>Manage places</Text>
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
                            }} onSubmitEditing={() => {
                                navigate('MainScreen', { cityName: searchText })
                            }} placeholder='Enter location' style={{}}></TextInput>
                    </View>



                    <View style={{ flex: 12, margin: 20 }}>
                    {/* .filter((eachLocation) => {
                            return eachLocation?.location?.toLowerCase()?.includes(searchText.toLowerCase())
                        }) */}
                        <FlatList data={locationData}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                return <LocationItem eachLocation={item} onPress={() => {
                                    navigate('MainScreen', { cityName: item.location })
                                    let newLocationData = locationData.map(eachLocationItem => {
                                        return {
                                            ...eachLocationItem,
                                            isSelected: item.location === eachLocationItem.location
                                        }
                                    })

                                    setLocationData(newLocationData)

                                }}>

                                </LocationItem>

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
                    style={{ height: 80, backgroundColor: 'white', marginHorizontal: 10, marginVertical: 10, flexDirection: 'row', justifyContent: 'center' }}>
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
                            onChangeText={ handleTextDebounce}
                            onSubmitEditing={() => {
                                navigate('MainScreen', { cityName: searchText })
                            }} placeholder='Enter location' style={{}}></TextInput>
                        
                    </View>
                    <TouchableOpacity onPress={() => setSearching(!searching)} style={{
                        marginTop: 20,
                        alignItems: 'center', height: 50, justifyContent: 'center'}}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                    
                </View>
                <View style={{height: 10}}>

                </View>
                <View style={{flex: 1, margin: 20, flexDirection: 'row', justifyContent: 'center'}}>
                    {
                        locations.length > 0 && searching ? (
                            <View>
                                {
                                locations.map((loc, index) => {
                                    return (
                                        <TouchableOpacity
                                        key={index}
                                        style = {{
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
                                            handleLocation(loc)
                                        }}
                                        >
                                            <Text>{loc?.name}, {loc?.country}</Text>
                                            <FontAwesomeIcon icon={faPlus} size = {15}></FontAwesomeIcon>
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