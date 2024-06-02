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
import { colors, fontSizes } from '../constants';
import { getData, storeData } from '../utilities/asyncStorage';


const SettingScreen = (props) => {
    const { navigation } = props;
    const { navigate } = navigation;
    let [isModalVisible, setModalVisible] = useState(false);
    let [isLanguage, setLanguage] = useState(false);
    let [isTemperature, setTemperature] = useState(false);
    let [languages, setLanguages] = useState([
        {
            name: 'VietNamese',
            isSelected: false
        },
        {
            name: 'English',
            isSelected: true
        },
    ]);
    let [temperatures, setTemperatures] = useState([
        {
            name: 'Celcius',
            isSelected: true
        },
        {
            name: 'Fahrenheit',
            isSelected: false
        },
    ]);
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const getAsyncData = async () => {
        let unit = await getData('unit');
        if (unit) {
            setTemperatures([{
                name: 'Celcius',
                isSelected: unit == 'Celcius'
            }, {
                name: 'Fahrenheit',
                isSelected: unit != 'Celcius'
            }])
        }
    }
    useEffect(() => {
        getAsyncData()
    }, [props?.route?.params])
    useEffect(() => {
        languages.map(item => {
            if (item.isSelected) {
                storeData('language', item.name)
            }
        })
    }, [languages])
    useEffect(() => {
        temperatures.map(item => {
            if (item.isSelected) {
                storeData('unit', item.name)
            }
        })
    }, [temperatures])
    return (
        <View style={{
            backgroundColor: 'white',
            flex: 1,
            padding: 20
        }}>
            <ModalSetting isVisible={isModalVisible}
            isLanguageOn={isLanguage}
            setVisible={setModalVisible}
            isTemperatureOn={isTemperature}
            languages={languages}
            setLanguages={setLanguages}
            temperatures={temperatures}
            setTemperatures={setTemperatures}></ModalSetting>
            <TouchableOpacity onPress={() => navigate('MainScreen', {unit: temperatures})} style={{ height: 40 }}>
                <FontAwesomeIcon icon={faArrowLeft} size={26}></FontAwesomeIcon>
            </TouchableOpacity>
            <View style={{ height: 60, justifyContent: 'center', borderBottomWidth: 1, borderColor: colors.fadeBlackTextColor }}>
                <Text style={{ fontSize: 34, color: colors.fadeBlackTextColor, fontWeight: '300', textAlignVertical: 'center' }}>Settings</Text>
            </View>

            {/**----------General------------- */}
            <View style={{ marginTop: 30 }}>
                <Text style={headerStyle}>General</Text>
                <View style={{
                    height: 40,
                    borderBottomWidth: 1,
                    borderColor: colors.fadeTextColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 10,
                    justifyContent: 'space-between'
                }}>
                    <Text style={normalTextStyle}>Language</Text>
                    <TouchableOpacity onPress={() => {setModalVisible(true), setLanguage(true), setTemperature(false)}}>
                    {languages.map(item => {
                            return item.isSelected ? <Text style={normalTextStyle}>{item.name}</Text> : null
                            
                        })}
                    </TouchableOpacity>

                </View>

                <View style={{
                    height: 40,
                    borderBottomWidth: 1,
                    borderColor: colors.fadeTextColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 10,
                    justifyContent: 'space-between'
                }}>
                    <Text style={normalTextStyle}>Temperature Units</Text>
                    <TouchableOpacity onPress={() => {setModalVisible(true), setTemperature(true), setLanguage(false)}}>
                        {temperatures.map(item => {
                            return item.isSelected ? <Text style={normalTextStyle}>{item.name}</Text> : null
                        })}
                    </TouchableOpacity>
                </View>
            </View>
            {/**----------Notifycation------------- */}
            <View style={{ marginTop: 30 }}>
                <Text style={headerStyle}>Notifications</Text>
                <View style={{
                    borderBottomWidth: 1,
                    borderColor: colors.fadeTextColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexGrow: 1,
                    margin: 10,
                    paddingBottom: 10,
                    justifyContent: 'space-between',
                    alignSelf: 'flex-start'
                }}>
                    <View style={{ flex: 8 }}>
                        <Text style={normalTextStyle}>Update at night automatically</Text>
                        <Text style={{ marginLeft: 10, color: colors.fadeBlackTextColor }}>Update weather info between 23:00 and 07:00</Text>
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
    textAlignVertical: 'center',
    margin: 10

})
export default SettingScreen;