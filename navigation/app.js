import React, {useState, useEffect, Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainScreen, LocationScreen, UpcomingWeatherScreen, SettingScreen, LocationPermissionScreen, WeatherReportScreen} from '../screens';

const Stack = createNativeStackNavigator();
const App = () => {
    return <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='MainScreen' component={MainScreen}></Stack.Screen>
            <Stack.Screen name='LocationScreen' component={LocationScreen}></Stack.Screen>
            <Stack.Screen name='UpcomingWeatherScreen' component={UpcomingWeatherScreen}></Stack.Screen>
            <Stack.Screen name='SettingScreen' component={SettingScreen}></Stack.Screen>
            <Stack.Screen name='LocationPermissionScreen' component={LocationPermissionScreen}></Stack.Screen>
            <Stack.Screen name='WeatherReportScreen' component={WeatherReportScreen}></Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>
}

export default App;