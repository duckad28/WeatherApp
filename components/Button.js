import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    Text,
} from 'react-native';
import { images, fontSizes, colors } from '../constants';


const Button = (props) => {
    let {content, onPress} = props;
    return (
        <TouchableOpacity style={{
            paddingHorizontal: 5,
            paddingVertical: 10,
            borderRadius: 25,
            backgroundColor: colors.buttonColor,
            width: 240
        }} onPress={onPress}>
            <Text style={{
                fontSize: fontSizes.h4,
                color: colors.textColor,
                textAlign: 'center'
            }}>{content}</Text>
        </TouchableOpacity>
    )
}
export default Button;