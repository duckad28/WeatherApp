import React, { useState, useEffect } from 'react';
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
import { colors, fontSizes } from '../constants';

const AqiScreen = (props) => {
    const { navigation } = props;
    const { navigate } = navigation;
    const [searchText, setSearchText] = useState('');
    
    return (
        <View style={{
            backgroundColor: 'white',
            flex: 1
        }}>
            <View style={{
                flex: 1,
                backgroundColor: 'white',
                marginHorizontal: 10,
                marginVertical: 10
                }}>
                <TouchableOpacity onPress={() => navigate('MainScreen')} style={{ height: 40 }}>
                    <FontAwesomeIcon icon={faArrowLeft} size={26}></FontAwesomeIcon>
                </TouchableOpacity>
                <View style={{
                    marginHorizontal: 20,
                    height: 80,
                    justifyContent: 'center'
                    }}>
                    <Text style={{ fontSize: 30, color: 'black', textAlignVertical: 'center' }}>Air Quality Index</Text>
                </View>
            </View>

            <View style = {{
                height: 100,
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'red'
            }}>
                <View>
                    <Text style={{
                        fontSize: 50,
                        fontWeight: '700',
                        color: colors.textColor,
                    }}>
                        56
                    </Text>
                </View>
                <View>

                </View>
                
            </View>
        </View>

    )
}

const label = (props) => {
    const {labelContent, labelColor} = props;
    return (
        <View style={{
            backgroundColor: labelColor,
            width: 50,
            height: 30,
        }}>
            <Text style={{
                color: colors.textColor,
                fontSize: fontSizes.h6
            }}>{labelContent}</Text>
        </View>
    )
}

export default AqiScreen;