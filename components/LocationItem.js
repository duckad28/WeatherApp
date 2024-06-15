import React, { useState, useEffect } from 'react';
import { Image, Text, View, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { fontSizes, icons, images } from '../constants/index';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, height } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faLocationPin, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { colors } from '../constants';
import { cToF } from '../utilities';
import backgroundServer from 'react-native-background-actions';


const LocationItem = (props) => {
    let {location, currentData, imageBackground, curloc} = props.eachLocation;
    let {unit} = props;
    let current_temperature = unit ? Math.round(currentData?.temp_c) : cToF(currentData?.temp_c);
    let onPress = props.onPress;

    
    return (
    <TouchableOpacity onPress={onPress} style={{ marginVertical: 10, flex: 1 }}>
            <ImageBackground 
                source={imageBackground} 
                style={{
                    height: 70,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: colors.locationColor,
                    borderRadius: 20}}
                imageStyle={{borderRadius: 20}}>

                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                    <View 
                        style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row', gap: 10, alignItems: 'center'}}
                    >
                        <Text 
                            style={textstyle}
                        >
                            {location}
                        </Text>
                        {curloc && <FontAwesomeIcon icon={faLocationPin} size={15} color='white'></FontAwesomeIcon>}
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
    fontSize: 20, fontWeight: '600', color: colors.textColor
})
export default LocationItem;