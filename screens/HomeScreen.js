import React, { useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity, Touchable } from 'react-native';
import {MainScreen} from './index'
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import LottieView from 'lottie-react-native';


const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const HomeView = (props) => {
    let {navigation} = props;
    let [check, setCheck] = useState(false);
    const changeScreen =async (props) => {
        await delay(2000);
        setCheck(true);
        navigation.navigate('MainScreen');
    }
    useEffect(() => {
        changeScreen();
    })
    return (
        <TouchableOpacity style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}
        onPress={() => {
            check && navigation.navigate('MainScreen')
        }}>
            <LottieView
                source={require("../assets/animations/animation.json")}
                style={{width: "100%", height: "100%"}}
                autoPlay
                loop
            />
        </TouchableOpacity>
    )
}

export default HomeView;