import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { colors, fontSizes } from '../constants';

const ExtraInfoItem = (props) => {
    let {name, value} = props.data;
    let {height} = props;
    let {nameStyle, valueStyle} = props;
    return (
        <View style={{
            height: height,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: colors.fadeTextColor,
            margin: 10
        }}>
            <Text style={nameStyle}>{name}</Text>
            <Text style={valueStyle}>{value}</Text>
        </View>
    )
}
export default ExtraInfoItem;