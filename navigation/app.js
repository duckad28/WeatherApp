import React, {useState, useEffect, Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
    MainScreen,
    LocationScreen,
    UpcomingWeatherScreen,
    SettingScreen,
    LocationPermissionScreen,
    WeatherReportScreen,
    AqiScreen,
    HomeView,
    WeatherForecast
} from '../screens';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import { Linking, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getFcmToken, registerListenerWithFCM } from '../components/pushNoti';
const NAVIGATION_IDS = ["MainScreen", "UpcomingWeatherScreen", "LocationPermissionScreen", "SettingScreen", "WeatherReportScreen", "AqiScreen", "HomeView"];

const Stack = createNativeStackNavigator();


const App = () => {
    useEffect(() => {
        getFcmToken();
      }, []);
    
      useEffect(() => {
        const unsubscribe = registerListenerWithFCM();
        return unsubscribe;
      }, []);
    return <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='MainScreen' component={MainScreen} initialParams={{cityName: 'Ha Noi'}}></Stack.Screen>
            <Stack.Screen name='LocationScreen' component={LocationScreen}></Stack.Screen>
            <Stack.Screen name='UpcomingWeatherScreen' component={UpcomingWeatherScreen}></Stack.Screen>
            <Stack.Screen name='SettingScreen' component={SettingScreen}></Stack.Screen>
            <Stack.Screen name='LocationPermissionScreen' component={LocationPermissionScreen}></Stack.Screen>
            <Stack.Screen name='WeatherReportScreen' component={WeatherReportScreen}></Stack.Screen>
            <Stack.Screen name='AqiScreen' component={AqiScreen}></Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>
}

export default App;