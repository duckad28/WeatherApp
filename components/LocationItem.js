import React, { useState, useEffect } from 'react';
import { Image, Text, View, FlatList, TouchableOpacity, Touchable, TextInput, KeyboardAvoidingView, Keyboard, Platform, Alert, ImageBackground } from 'react-native';
import { fontSizes, icons, images } from '../constants/index';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, height } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faLocationPin, faSearch } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../constants';
import Temperature from './Temperature';


const LocationItem = (props) => {
    let {location} = props.eachLocation;
    let onPress = props.onPress;
    return (
    <TouchableOpacity onPress={onPress} style={{ marginVertical: 10, flex: 1 }}>
            <ImageBackground source={images.image1} style={{
                height: 60,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
                backgroundColor: colors.locationColor,
                borderRadius: 30}}
                imageStyle={{borderRadius: 30}}>

                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textColor }}>{location}</Text>
                          {/* {isSelected == true && <FontAwesomeIcon icon={faLocationPin} color={colors.textColor} style={{ marginLeft: 6 }} size={18}></FontAwesomeIcon>} */}
                    </View>
                </View>
            </ImageBackground>
    </TouchableOpacity>)
}
export default LocationItem;