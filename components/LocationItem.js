import React, { useState, useEffect } from 'react';
import { Image, Text, View, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { fontSizes, icons, images } from '../constants/index';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, height } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faLocationPin, faSearch } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../constants';
import { cToF } from '../utilities';


const LocationItem = (props) => {
    let {location, currentData, imageBackground} = props.eachLocation;
    let {unit} = props;
    let current_temperature = unit ? Math.round(currentData?.temp_c) : cToF(currentData?.temp_c);
    let onPress = props.onPress;
    return (
    <TouchableOpacity onPress={onPress} style={{ marginVertical: 10, flex: 1 }}>
            <ImageBackground 
                source={imageBackground} 
                style={{
                    height: 60,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: colors.locationColor,
                    borderRadius: 30}}
                imageStyle={{borderRadius: 30}}>

                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                    <View 
                        style={{flex: 1, justifyContent: 'flex-start'}}
                    >
                        <Text 
                            style={textstyle}
                        >
                            {location}
                        </Text>
                    </View>
                        
                    <Text 
                        style={textstyle}
                    >
                        {current_temperature}°
                    </Text>
                </View>
                
            </ImageBackground>
    </TouchableOpacity>)
}
const textstyle = StyleSheet.create({
    fontSize: 18, fontWeight: '600', color: colors.textColor
})
export default LocationItem;