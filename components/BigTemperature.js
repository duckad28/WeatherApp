import React from 'react';
import { Text, View } from 'react-native';
import { colors, fontSizes } from '../constants';

const BigTemperature = (props) => {
    let { currentTemp, unit } = props;
    let u = unit ? 'C' : 'F';
    return (
        <View style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center'
        }}>
            <Text style={{
                fontSize: 120,
                color: colors.textColor
            }}>{currentTemp}</Text>
            <View>
                <Text style={{
                    position: 'absolute', top: 20, left: 12, fontSize: 30, color: colors.textColor
                }}>°{u}</Text>
            </View>
        </View>
    )
}

export default BigTemperature;