import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    Text,
} from 'react-native';
import { images, fontSizes, colors } from '../constants';


const SmallButton = (props) => {
    let {content, onPress} = props;
    return (
        <TouchableOpacity style={{
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 15,
            backgroundColor: colors.buttonColor
        }} onPress={onPress}>
            <Text style={{
                fontSize: fontSizes.h7,
                color: colors.textColor,
                textAlign: 'center'
            }}>{content}</Text>
        </TouchableOpacity>
    )
}
export default SmallButton;