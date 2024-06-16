import PushNotification from 'react-native-push-notification';
import notifee, { EventType, AndroidStyle, TimestampTrigger, TriggerType, AndroidImportance, RepeatFrequency } from '@notifee/react-native';
import { getLocationData } from './locationStorage';
import { viText, images } from '../constants';
import { getDayOfWeek, getWeatherIcon, cToF } from '../utilities';

export const checkBadWeather = (weather) => {
  let aqi = weather?.air_quality["us-epa-index"];
  let condi = weather?.condition?.text.trim().toLowerCase();
  let precip = weather?.totalprecip_mm;
  let max = weather?.maxtemp_c;
  let min = weather?.mintemp_c;
  let uv = weather?.uv;
  let res = '';
  if (aqi > 4) {
    res += 'Chất lượng không khí xấu, hạn chế các hoạt động ngoài trời và mang theo đồ bảo hộ khi ra ngoài.' + '\n';
  }
  if (condi.includes('blizzard') || condi.includes('fog') || condi.includes('blowing')) {
    res += 'Thời tiết xấu, chú ý cẩn thận khi ra ngoài trời.' + '\n';
  }
  if (precip > 50) {
    res += 'Có mưa to, chú ý khi ra ngoài trời.' + '\n';
  }
  if (max > 40) {
    res += 'Thời tiết nóng nực, chú ý không để mất nước.' + '\n';
  }
  if (min < 10) {
    res += 'Thời tiết lạnh, chú ý giữ ấm cho cơ thể.' + '\n';
  }
  if (uv > 9) {
    res += 'Chí số bức xạ cao, tránh tiếp xúc trực tiếp với ánh nắng.' + '\n';
  }
  return res;
}

export const createNoti = async () => {
  let noti = await getLocationData('noti');
  if (noti) {
    notifee.cancelAllNotifications();
    let weatherArr = noti?.forecastData;
    if (weatherArr) {
      let n = weatherArr.length;
      let i = 0;
      let now = new Date();
      while (i < n) {
        let notiTemp = weatherArr[i];
        let then = new Date(notiTemp?.date);
        if (notiTemp && then.valueOf() > now.valueOf()) {
          let warning = checkBadWeather(notiTemp?.day);

          if (warning.length > 5) {
            let notif = {
              title: 'Cảnh báo điều kiện thời tiết xấu',
              body: warning,
              current_icon: getWeatherIcon(notiTemp?.day?.condition?.icon),
            }
            if (notif) {
              onCreateTriggerNotification(notiTemp?.date, 6, 0, notif);
              onCreateTriggerNotification(notiTemp?.date, 9, 0, notif);
              onCreateTriggerNotification(notiTemp?.date, 12, 0, notif);
              onCreateTriggerNotification(notiTemp?.date, 15, 0, notif);
              onCreateTriggerNotification(notiTemp?.date, 18, 0, notif);
            }

          }
          let content = 'Thông tin thời tiết ngày hôm nay: ' + viText[notiTemp?.day?.condition?.text.trim().toLowerCase()] + "\n"
              + 'Nhiệt độ trong ngày: ' + Math.round(notiTemp?.day?.avgtemp_c) + "°" + "\n"
              + 'Khả năng có mưa: ' + notiTemp?.day?.daily_chance_of_rain + "%" + "\n";
          let notif1 = {
            title: notiTemp?.location,
            body: content,
            current_icon: getWeatherIcon(notiTemp?.day?.condition?.icon)
          }
          if (notif1) {
            onCreateTriggerNotification(notiTemp?.date, 6, 0, notif1);
          }

        }
        i++;
        if (i < n) {

          let notiTemp2 = weatherArr[i];
          if (notiTemp2) {
            let content2 = 'Thông tin thời tiết ngày mai: ' + viText[notiTemp2?.day?.condition?.text.trim().toLowerCase()] + "\n"
                + 'Nhiệt độ trong ngày: ' + Math.round(notiTemp2?.day?.avgtemp_c) + "°" + "\n"
                + 'Khả năng có mưa: ' + notiTemp2?.day?.daily_chance_of_rain + "%" + "\n";
            let notif2 = {
              title: notiTemp2?.location,
              body: content2,
              current_icon: getWeatherIcon(notiTemp2?.day?.condition?.icon)
            }
            if (notif2) {
              onCreateTriggerNotification(notiTemp?.date, 20, 0);
            }
          }
        }
      }
    }
  }
}



export async function onCreateTriggerNotification(newDate, h, m, notif) {
  const channelId = await notifee.createChannel({
    id: "test-channel",
    name: "Test Channel",
    importance: AndroidImportance.HIGH,
  });
  const now = new Date();
  const date = new Date(newDate);
  date.setHours(h);
  date.setMinutes(m);
  date.setMinutes(0);
  if (now.valueOf() < date.valueOf()) {
  // Create a time-based trigger
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
  };
  let cur_icon = images[notif?.current_icon];

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      title: notif?.title,
      body: notif?.body,
      largeIcon: cur_icon,
      android: {
        channelId: 'test-channel',
        autoCancel: false,
        color: '#4caf50',
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
}

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
