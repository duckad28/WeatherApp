import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { PERMISSIONS, request } from 'react-native-permissions';
import { Linking, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocationData } from '../utilities/locationStorage';
import { getData, storeData } from '../utilities/asyncStorage';

export const sendNotification = async () => {

}

export const getFcmToken = async () => {
  let token = null;
  await checkApplicationNotificationPermission();
  await registerAppWithFCM();
  token = await getData('fcmToken');
  if (!token) {
    try {
      token = await messaging().getToken();
      await storeData('fcmToken', token);
      console.log('getFcmToken-->', token);
    } catch (error) {
      console.log('getFcmToken Device Token error ', error);
    }
  }

  return token;
};

//method was called on  user register with firebase FCM for notification
export async function registerAppWithFCM() {
  console.log(
    'registerAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging()
      .registerDeviceForRemoteMessages()
      .then(status => {
        console.log('registerDeviceForRemoteMessages status', status);
      })
      .catch(error => {
        console.log('registerDeviceForRemoteMessages error ', error);
      });
  }
}

//method was called on un register the user from firebase for stoping receiving notifications
export async function unRegisterAppWithFCM() {
  console.log(
    'unRegisterAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );

  if (messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging()
      .unregisterDeviceForRemoteMessages()
      .then(status => {
        console.log('unregisterDeviceForRemoteMessages status', status);
      })
      .catch(error => {
        console.log('unregisterDeviceForRemoteMessages error ', error);
      });
  }
  await messaging().deleteToken();
  console.log(
    'unRegisterAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );
}

export const checkApplicationNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
    .then(result => {
      console.log('POST_NOTIFICATIONS status:', result);
    })
    .catch(error => {
      console.log('POST_NOTIFICATIONS error ', error);
    });
};

//method was called to listener events from firebase for notification triger
export function registerListenerWithFCM() {

  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('onMessage Received : ', JSON.stringify(remoteMessage));
    if (
      remoteMessage?.notification?.title &&
      remoteMessage?.notification?.body
    ) {
      onDisplayNotification(
        remoteMessage.notification?.title,
        remoteMessage.notification?.body,
        remoteMessage?.data,
      );
    }
  });

  notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        // if (detail?.notification?.data?.clickAction) {
        //   onNotificationClickActionHandling(
        //     detail.notification.data.clickAction
        //   );
        // }
        break;
    }
  });

  messaging()
    .onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'onNotificationOpenedApp Received',
        JSON.stringify(remoteMessage),
      );
      // if (remoteMessage?.data?.clickAction) {
      //   onNotificationClickActionHandling(remoteMessage.data.clickAction);
      // }
    });
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  return unsubscribe;
}

//method was called to display notification
async function onDisplayNotification(title, body, data) {
  console.log('onDisplayNotification Adnan: ', JSON.stringify(data));

  // Request permissions (required for iOS)
  await notifee.requestPermission();
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  let a = await getData('city');
  // Display a notification
  await notifee.displayNotification({
    title: a,
    body: a,
    data: data,
    android: {
      channelId,
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}