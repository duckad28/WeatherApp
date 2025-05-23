import React, { useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Switch,
    Text,
    StyleSheet,
    Modal
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { DataSelections } from '../components';
import { colors, fontSizes, viText } from '../constants';
import { getData, storeData } from '../utilities/asyncStorage';
import { getLocationData, storeLocationData } from '../utilities/locationStorage';
import PushNotification from 'react-native-push-notification';
import notifee, { EventType, AndroidStyle } from '@notifee/react-native';
const en = ['Settings','General', 'Language', 'Temperature Units', 'Notifications', 'Update at night automatically', 'Update weather info at different times of the day'];
const vn = ['Cài đặt','Thông tin chung', 'Ngôn ngữ', 'Đơn vị nhiệt độ', 'Thông báo', 'Cập nhật tự động vào buổi tối', 'Cập nhật thông tin thời tiết vào các khung giờ trong ngày']

import { onDisplayNotification, onCreateTriggerNotification, createNoti } from '../utilities/pushNoti';


const SettingScreen = (props) => {
    
    const { navigation } = props;
    const { navigate } = navigation;
    let {route} = props;

    // Modal
    let [isModalVisible, setModalVisible] = useState(false);
    let [isLanguage, setLanguage] = useState(false);
    let [isTemperature, setTemperature] = useState(false);

    // Setting
    let [isC, setIsC] = useState(route?.params?.unit);
    let [isE, setIsE] = useState(route?.params?.lang);
    let [lan, setLan] = useState(route?.params?.lang ? en : vn);

    // Item
    let [languages, setLanguages] = useState([
        {
            name: 'Tiếng Việt',
            isSelected: !route?.params?.lang
        },
        {
            name: 'English',
            isSelected: route?.params?.lang
        },
    ]);

    let [temperatures, setTemperatures] = useState([
        {
            name: 'Celcius',
            isSelected: route?.params?.unit
        },
        {
            name: 'Fahrenheit',
            isSelected: !route?.params?.unit
        },
    ]);
    const [isEnabled, setIsEnabled] = useState(true);

    
    
    const toggleSwitch = () => {
        if (!isEnabled) {
            createNoti();
        } else {
            notifee.cancelAllNotifications();
        }
        setIsEnabled(previousState => !previousState);
    };

    useEffect(() => {
        languages.map(item => {
            if (item.isSelected) {
                storeData('language', item.name)
                setIsE(item.name == 'English');
                setLan((item.name == 'English') ? en : vn);
            }
        })
    }, [languages])

    useEffect(() => {
        temperatures.map(item => {
            if (item.isSelected) {
                storeData('unit', item.name);
                setIsC(item.name == 'Celcius');
            }
        })
    }, [temperatures])

    const getNotiEn = async () => {
        let enable = await getData('NotificationEnabled');
        setIsEnabled(enable == 'true');
    }
    useEffect(() => {
        getNotiEn();
    }, [])
    return (
        <View style={{
            backgroundColor: 'white',
            flex: 1,
            padding: 20
        }}>
            <ModalSetting 
                isVisible={isModalVisible}
                isLanguageOn={isLanguage}
                setVisible={setModalVisible}
                isTemperatureOn={isTemperature}
                languages={languages}
                setLanguages={setLanguages}
                temperatures={temperatures}
                setTemperatures={setTemperatures}>
            </ModalSetting>
            <TouchableOpacity
                onPress={() => {
                    storeData('NotificationEnabled', isEnabled + "");
                    navigate('MainScreen', {unit: isC, lang: isE})}
                    }
                style={{ height: 40 }}>
                <FontAwesomeIcon icon={faArrowLeft} size={26}></FontAwesomeIcon>
            </TouchableOpacity>
            <View style={{ height: 60, justifyContent: 'center', borderBottomWidth: 1, borderColor: colors.fadeBlackTextColor }}>
                <Text style={{ fontSize: 34, color: colors.fadeBlackTextColor, fontWeight: '300', textAlignVertical: 'center' }}>{lan[0]}</Text>
            </View>

            {/**----------General------------- */}
            <View style={{ marginTop: 30 }}>
                <Text style={headerStyle}>{lan[1]}</Text>
                <View style={{
                    height: 40,
                    ...generalStyle
                }}>
                    <Text style={normalTextStyle}>{lan[2]}</Text>
                    <TouchableOpacity onPress={() => {setModalVisible(true), setLanguage(true), setTemperature(false)}}>
                    {languages.map((item, index) => {
                            return item.isSelected ? <Text key={index} style={normalTextStyle}>{item.name}</Text> : null
                            
                        })}
                    </TouchableOpacity>

                </View>

                <View style={{
                    height: 40,
                    ...generalStyle
                }}>
                    <Text style={normalTextStyle}>{lan[3]}</Text>
                    <TouchableOpacity onPress={() => {setModalVisible(true), setTemperature(true), setLanguage(false)}}>
                        {temperatures.map((item, index) => {
                            return item.isSelected ? <Text key ={index} style={normalTextStyle}>{item.name}</Text> : null
                        })}
                    </TouchableOpacity>
                </View>
            </View>
            {/**----------Notifycation------------- */}
            <View style={{ marginTop: 30 }}>
                <Text style={headerStyle}>{lan[4]}</Text>
                <View style={{
                    ...generalStyle,
                    flexGrow: 1,
                    paddingBottom: 10,
                    alignSelf: 'flex-start'
                }}>
                    <View style={{ flex: 8 }}>
                        <Text style={normalTextStyle}>{lan[5]}</Text>
                        <Text style={{ marginLeft: 10, color: colors.fadeBlackTextColor }}>{lan[6]}</Text>
                    </View>

                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <Switch
                            trackColor={{ false: '#767577', true: '#abdbe3' }}
                            thumbColor={isEnabled ? colors.switchColor : '#f4f3f4'}
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

{/**-------------------------Modal Layout---------------------------- */}
const ModalSetting = (props) => {
    let { isVisible } = props;
    let isLanguageOn = props.isLanguageOn;
    let { setVisible } = props;
    let isTemperatureOn = props.isTemperatureOn;
    return (
        <Modal visible={isVisible} transparent={true}>
            <TouchableOpacity onPress={() => setVisible(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <View style={{ height: 200, width: '100%' }}></View>
                {isLanguageOn && <DataSelections data={props.languages} setData={props.setLanguages} len={2}></DataSelections>}
                <View style={{ height: 60, width: '100%' }}></View>
                {isTemperatureOn && <DataSelections data={props.temperatures} setData={props.setTemperatures} len={2}></DataSelections>}
            </TouchableOpacity>
        </Modal>)
}


const headerStyle = StyleSheet.create({
    fontSize: fontSizes.h4,
    color: 'black',
    fontWeight: '500'
})

const normalTextStyle = StyleSheet.create({
    fontSize: fontSizes.h5,
    color: colors.fadeBlackTextColor,
    fontWeight: '500',
    textAlignVertical: 'top',
    marginHorizontal: 10
})

const generalStyle = StyleSheet.create({
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    borderBottomWidth: 1,
    borderColor: colors.fadeTextColor,
})

export default SettingScreen;