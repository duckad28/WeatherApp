import React from 'react';
import { Text, View } from 'react-native';
import { colors, fontSizes } from '../constants';
import { cToF } from '../utilities';

const Temperature = (props) => {
    let {highest, lowest, fontSize, unit} = props;
    return (
        <View style={{
            flexDirection: 'row',
            width: 60
        }}>

            <Text style={{color: colors.textColor, fontSize: fontSize}}>{unit ? highest : cToF(highest)}°</Text>

            <Text style={{
                color: colors.textColor, fontSize: fontSize
            }}>/</Text>

            <Text style={{color: colors.textColor, fontSize: fontSize}}>{unit ? lowest : cToF(lowest)}°</Text>
        </View>
    )
}

export default Temperature;