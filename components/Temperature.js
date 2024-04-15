import React from 'react';
import { Text, View } from 'react-native';
import { colors, fontSizes } from '../constants';

const Temperature = (props) => {
    let {highest, lowest, fontSize} = props;
    return (
        <View style={{
            flexDirection: 'row',
        }}>

            <Text style={{color: colors.textColor, fontSize: fontSize}}>{highest}</Text>
            <View style={{
            }}>
                <Text style={{ position: 'absolute', top: 0, fontSize: fontSize/2, color: colors.textColor }}>o</Text>
            </View>

            <Text style={{
                paddingLeft: fontSize/4,
                marginHorizontal: fontSize/4,
                color: colors.textColor, fontSize: fontSize
            }}>/</Text>

            <Text style={{color: colors.textColor, fontSize: fontSize}}>{lowest}</Text>
            <View style={{
                width: 10
            }}>
                <Text style={{ position: 'absolute', top: 0, fontSize: fontSize/2, color: colors.textColor }}>o</Text>
            </View>
        </View>
    )
}

export default Temperature;