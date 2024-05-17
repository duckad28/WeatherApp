import React from 'react';
import { Text, View } from 'react-native';
import { colors, fontSizes } from '../constants';

const Temperature = (props) => {
    let {highest, lowest, fontSize} = props;
    return (
        <View style={{
            flexDirection: 'row',
            width: 60
        }}>

            <Text style={{color: colors.textColor, fontSize: fontSize}}>{highest}°</Text>

            <Text style={{
                color: colors.textColor, fontSize: fontSize
            }}>/</Text>

            <Text style={{color: colors.textColor, fontSize: fontSize}}>{lowest}°</Text>
        </View>
    )
}

export default Temperature;