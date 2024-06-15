import PushNotification from 'react-native-push-notification';
import notifee, { EventType, AndroidStyle, TimestampTrigger, TriggerType, AndroidImportance, RepeatFrequency } from '@notifee/react-native';
import { getLocationData } from './locationStorage';
import { viText, images } from '../constants';
import { getDayOfWeek, getWeatherIcon, cToF } from '../utilities';

export async function onDisplayNotification() {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "test-channel",
    name: "Test Channel",
    importance: AndroidImportance.HIGH,
  });

  let noti = await getLocationData('noti');
  // Display a notification
  if (noti) {
    let current_icon = images[getWeatherIcon(noti?.forecastData[0]?.day?.condition?.icon)];
    await notifee.displayNotification({
      title: `<p style="color: #000000;"><b>${noti?.location}</span></p></b></p>`,
      body:
        `<p>Thời tiết ngày hôm nay: ${viText[noti?.forecastData[0]?.day?.condition?.text.trim().toLowerCase()]}
          <br>Nhiệt độ cao nhất : ${Math.round(noti?.forecastData[0]?.day?.maxtemp_c)}
          <br>Nhiệt độ thấp nhất : ${Math.round(noti?.forecastData[0]?.day?.mintemp_c)}
          <br>Khả năng có mưa : ${Math.round(noti?.forecastData[0]?.day["daily_chance_of_rain"])}</p>`,
      android: {
        channelId,
        autoCancel: false,
        color: '#4caf50',
        largeIcon: current_icon,
        actions: [
          {
            title: '<b>Xem thêm</b>',
            pressAction: { id: 'more' },
          },
          {
            title: '<p style="color: #f44336;"><b>Đóng</b></p>',
            pressAction: { id: 'cancel' },
          },
        ],
        importance: AndroidImportance.HIGH
      },
    });
  }
}

export async function onCreateTriggerNotification(h, m, notif) {
  const channelId = await notifee.createChannel({
    id: "test-channel",
    name: "Test Channel",
    importance: AndroidImportance.HIGH,
  });
  const date = new Date(Date.now());
  date.setHours(h);
  date.setMinutes(m);

  // Create a time-based trigger
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
    repeatFrequency: RepeatFrequency.DAILY,
  };

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      title: notif.title,
      body: notif.body,
      android: {
        channelId: 'test-channel',
        autoCancel: false,
        color: '#4caf50',
        largeIcon: current_icon,
        actions: [
          {
            title: '<b>Xem thêm</b>',
            pressAction: { id: 'more' },
          },
          {
            title: '<p style="color: #f44336;"><b>Đóng</b></p>',
            pressAction: { id: 'cancel' },
          },
        ],
        importance: AndroidImportance.HIGH
      },
    },
    trigger,
  );
}

const handleNotification = async () => {
  let noti = await getLocationData('noti');
  if (noti) {
    console.log(noti?.location)
    let notif = {
      title: noti?.location,
      message: 'Dự báo thời tiết trong ngày:' + "\n"
        + viText[noti?.forecastData[0]?.day?.condition?.text.trim().toLowerCase()] + "\n"
        + 'Nhiệt độ cao nhất: ' + noti?.forecastData[0]?.day?.maxtemp_c + "°" + "\n"
        + 'Nhiệt độ thấp nhất: ' + noti?.forecastData[0]?.day?.mintemp_c + "°" + "\n"
        + 'Khả năng có mưa: ' + noti?.forecastData[0]?.day?.daily_chance_of_rain + "%" + "\n",
    }
    PushNotification.cancelAllLocalNotifications();

    PushNotification.localNotification({
      channelId: "test-channel",
      title: notif.title,
      message: notif.message,
      color: "red",
      soundName: 'sound.mp3',
      playSound: true,
      id: 1
    });

    PushNotification.localNotificationSchedule({
      channelId: "test-channel",
      title: "Alarm",
      message: "You clicked on " + " 20 seconds ago",
      date: new Date(Date.now() + 20 * 1000),
      allowWhileIdle: true,
      repeatTime: 4,
    });
  }
}
