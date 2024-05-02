import React, {useState, useEffect} from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    Text,
    TextInput, 
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { LocationItem } from '../components';
import { colors } from '../constants';

const LocationScreen = (props) => {
    const { navigation } = props;
    const { navigate } = navigation;
    const [searchText, setSearchText] = useState('');
    // useEffect(() => {
    //     Keyboard.addListener(
    //         'keyboardDidShow', () => {
    //             setIsKeyBoardShown(true)
    //         }
    //     )
    //     Keyboard.addListener(
    //         'keyboardDidHide', () => {
    //             setIsKeyBoardShown(false)
    //         }
    //     )
    // })
    const [locationData, setLocationData] = useState([
    {
        location: 'Ha Noi',
        highest: 34,
        lowest: 24,
        current: 30,
        isSelected: true
    },
    {
        location: 'Hai Duong',
        highest: 34,
        lowest: 24,
        current: 30,
        isSelected: false
    },
    {
            location: 'Hai Phong',
            highest: 34,
            lowest: 24,
            current: 30,
            isSelected: false
        },
    // {
    //     location: 'Hoang Sa',
    //     highest: 34,
    //     lowest: 24,
    //     current: 30,
    //     isSelected: true
    // },
    // {
    //     location: 'Hai Phong',
    //     highest: 34,
    //     lowest: 24,
    //     current: 30,
    //     isSelected: false
    // },
    // {
    //     location: 'Hoang Thuong',
    //     highest: 34,
    //     lowest: 24,
    //     current: 30,
    //     isSelected: true
    // },
    // {
    //     location: 'Hai tu',
    //     highest: 34,
    //     lowest: 24,
    //     current: 30,
    //     isSelected: false
    // },
    

])
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
            alignItems: 'center' }}>
            <FontAwesomeIcon icon={faSearch} size={18} style={{ paddingHorizontal: 20 }}></FontAwesomeIcon>
            <TextInput onChangeText={(text) => {
                setSearchText(text)
            }} onSubmitEditing={() => {
                navigate('MainScreen', {cityName: searchText})
            }} placeholder='Enter location' style={{}}></TextInput>
        </View>



            <View style={{ flex: 12, margin: 20 }}>
                <FlatList data={locationData.filter((eachLocation) => {
                    return eachLocation.location.toLowerCase().includes(searchText.toLowerCase())
                })}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return <LocationItem eachLocation={item} onPress={() => {
                            navigate('MainScreen', {cityName: item.location})
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

export default LocationScreen;