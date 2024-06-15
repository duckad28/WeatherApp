import React, { useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Switch,
    Text,
    StyleSheet,
    PermissionsAndroid,
    Platform
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { colors, fontSizes, images } from '../constants';
import { getData, storeData } from '../utilities/asyncStorage';

const en = ['Location', 'Location access', 'Apps that have this permission can get your location info'];
const vn = ['Vị trí', 'Truy cập vị trí', 'Ứng dụng có quyền này có thể lấy thông tin vị trí của bạn']

const LocationPermissionScreen = (props) => {
    const [isEnabled, setIsEnabled] = useState(props.route.params.permission);
    const { navigation } = props;
    const { navigate } = navigation;
    const {route} = props;
    let [change, setChange] = useState(0);
    let {lang} = props.route.params;
    let lan = lang ? en : vn;

    const requestLocationPermission = async () => {
            if (Platform.OS == 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                    if (granted == PermissionsAndroid.RESULTS.GRANTED) {
                        setIsEnabled(true);
                        setChange(1);
                        await storeData('LocationPermission', "true");
                    } else {
                        setIsEnabled(false);
                        await storeData('LocationPermission', "false");
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        //location
    };

    return (
        <View style={{
            backgroundColor: 'white',
            flex: 1,
            padding: 20
        }}>
            <TouchableOpacity onPress={() => {
                navigate('MainScreen', {permission: change, lang: route?.params?.lang, unit: route?.params?.unit})}
             } style={{ height: 40 }}>
                <FontAwesomeIcon icon={faArrowLeft} size={26}></FontAwesomeIcon>
            </TouchableOpacity>
            <View style={{ height: 60, justifyContent: 'center', borderBottomWidth: 1, borderColor: colors.fadeBlackTextColor }}>
                <Text style={{ fontSize: 34, color: colors.fadeBlackTextColor, fontWeight: '300', textAlignVertical: 'center' }}>{lan[0]}</Text>
            </View>


            <View style={{ marginTop: 30, flex: 1 }}>
                <Text style={headerStyle}>{lan[1]}</Text>
                <View style={{
                    borderBottomWidth: 1,
                    borderColor: colors.fadeTextColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 10,
                    justifyContent: 'space-between',
                    alignSelf: 'flex-start'
                }}>
                    <Text style={{ ...normalTextStyle, flex: 8 }}>{lan[2]}</Text>
                    <View style={{ flex: 2 }}>
                        <Switch
                            trackColor={{ false: '#767577', true: '#abdbe3' }}
                            thumbColor={isEnabled ? colors.switchColor : '#f4f3f4'}
                            onValueChange={() => {
                                if (!isEnabled) {
                                    requestLocationPermission();
                                }
                            }}
                            value={isEnabled}
                        />
                    </View>



                </View>
            </View>
        </View>
    )
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
export default LocationPermissionScreen;