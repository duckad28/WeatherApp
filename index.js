/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './navigation/app';
import PushNotification from "react-native-push-notification";
import notifee, { EventType, AndroidStyle, TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

PushNotification.configure({
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
  },
  requestPermissions: Platform.OS === 'ios'
});


notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log('type', type, detail);
  if (type == EventType.ACTION_PRESS && detail.pressAction?.id == 'cancel') {
    await notifee.cancelNotification(detail.notification.id)
  }
  if (type == EventType.ACTION_PRESS && detail.pressAction?.id == 'more') {
    alert("hals")
  }
})

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('killed state')
})
AppRegistry.registerComponent(appName, () => () => <App></App>);

