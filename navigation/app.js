import React, { useState, useEffect, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    MainScreen,
    LocationScreen,
    UpcomingWeatherScreen,
    SettingScreen,
    LocationPermissionScreen,
    AqiScreen,
} from '../screens';
import messaging from '@react-native-firebase/messaging';
import { PERMISSIONS, request } from 'react-native-permissions';
import { PermissionsAndroid } from 'react-native';
import { Linking, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, storeData } from '../utilities/asyncStorage';
import { getLocationData, storeLocationData } from '../utilities/locationStorage';
import notifee, { EventType, AndroidStyle, TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';
import usePushNotification from '../utilities/firebasenoti';
import PushNotification from "react-native-push-notification";
import BackgroundService from 'react-native-background-actions';
import { onCreateTriggerNotification } from '../utilities/pushNoti';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise( async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            await sleep(delay);
        }
    });
};


const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
        delay: 1000,
    },
};


const NAVIGATION_IDS = ["MainScreen", "UpcomingWeatherScreen", "LocationPermissionScreen", "SettingScreen", "WeatherReportScreen", "AqiScreen", "HomeView"];

const Stack = createNativeStackNavigator();

const createChannels = () => {
    PushNotification.createChannel(
        {
            channelId: "test-channel",
            channelName: "Test Channel"
        }
    )
}

const App = () => {
    const getNoti = async () => {
        let notiEn = await getData('NotificationEnabled');
        if (notiEn == 'true') {
            let noti = await getLocationData('noti');
            if (noti) {
                let noti1 = {
                    title: 'Dự báo thời tiết ngày hôm nay',
                    body: 1,
                }
                let noti2 = {
                    title: 'Dự báo thời tiết ngày mai',
                    body: 2,
                }
                onCreateTriggerNotification(6, 0, noti1);
                onCreateTriggerNotification(20, 0, noti2);
            }
        }
    }
    useEffect(() => {
        // BackgroundService.start(veryIntensiveTask, options);
        createChannels();
        // getNoti();
    }, [])
    return <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='MainScreen' component={MainScreen}></Stack.Screen>
            <Stack.Screen name='LocationScreen' component={LocationScreen}></Stack.Screen>
            <Stack.Screen name='UpcomingWeatherScreen' component={UpcomingWeatherScreen}></Stack.Screen>
            <Stack.Screen name='SettingScreen' component={SettingScreen}></Stack.Screen>
            <Stack.Screen name='LocationPermissionScreen' component={LocationPermissionScreen}></Stack.Screen>
            <Stack.Screen name='AqiScreen' component={AqiScreen}></Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>
}

export default App;