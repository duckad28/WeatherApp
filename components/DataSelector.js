import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import { colors, fontSizes } from '../constants';
import { getData, storeData } from '../utilities/asyncStorage';

const DataSelections = (props) => {

    let { data } = props;
    let { setData } = props;
    let { len } = props;
    return (
        <View style={{
            margin: 20,
            width: 160,
            height: 40 * len,
            backgroundColor: 'white',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            alignSelf: 'flex-end',
            borderRadius: 15,
            overflow: 'hidden'
        }}>
            {
                data.map(item => {
                    return <SettingItem setting={item} onPress={() => {
                        let newData = data.map(eachItem => {
                            return {
                                ...eachItem,
                                isSelected: eachItem.name === item.name
                            }
                        })
                        setData(newData)
                    }}></SettingItem>
                })
            }

        </View>
    )
}

const SettingItem = (props) => {
    let { name, isSelected } = props.setting;
    let onPress = props.onPress;
    return (

        <TouchableOpacity onPress={onPress} style={{
            flex: 1, width: '100%',
            backgroundColor: isSelected ? colors.backgroundColor : null,
        }}>
            <Text style={normalTextStyle}>{name}</Text>
        </TouchableOpacity>


    )
}

const normalTextStyle = StyleSheet.create({
    fontSize: fontSizes.h5,
    color: colors.fadeBlackTextColor,
    fontWeight: '500',
    textAlignVertical: 'center',
    margin: 10
})

export default DataSelections;