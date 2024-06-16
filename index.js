/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './navigation/app';
import PushNotification from "react-native-push-notification";
import notifee, { EventType, AndroidStyle, TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';

PushNotification.configure({
  onAction: function (notification) {
      if (notification.action === 'More') {
          console.log('Alarm Snoozed');
      }
      else if (notification.action === 'Cancel') {
          PushNotification.cancelLocalNotification(notification.id);
      }
      else {
          console.log('Notification opened');
      }
  },
  actions: ["More", "Cancel"],
});


notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log('type', type, detail);
  if (type == EventType.ACTION_PRESS && detail.pressAction?.id == 'Cancel') {
    await notifee.cancelNotification(detail.notification.id)
  }
  if (type == EventType.ACTION_PRESS && detail.pressAction?.id == 'More') {
  }
})

AppRegistry.registerComponent(appName, () => () => <App></App>);

