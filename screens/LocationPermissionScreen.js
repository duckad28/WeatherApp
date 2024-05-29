import React, { useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Switch,
    Text,
    StyleSheet,
    PermissionsAndroid
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { colors, fontSizes } from '../constants';
import GeoLocation from "@react-native-community/geolocation";
import { getData, storeData } from '../utilities/asyncStorage';

const LocationPermissionScreen = (props) => {
    const [isEnabled, setIsEnabled] = useState(props.route.params.permission);
    const toggleSwitch = () => { setIsEnabled(previousState => !previousState) };
    const { navigation } = props;
    const { navigate } = navigation;
    const requestLocationPermission = () => {
        if (isEnabled) {
            GeoLocation.getCurrentPosition(position => {
                console.log(position);
            })

            const granted = PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            //console.log(position);
            return granted;
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
                storeData('LocationPermission', isEnabled + "");
                navigate('MainScreen')}
             } style={{ height: 40 }}>
                <FontAwesomeIcon icon={faArrowLeft} size={26}></FontAwesomeIcon>
            </TouchableOpacity>
            <View style={{ height: 60, justifyContent: 'center', borderBottomWidth: 1, borderColor: colors.fadeBlackTextColor }}>
                <Text style={{ fontSize: 34, color: colors.fadeBlackTextColor, fontWeight: '300', textAlignVertical: 'center' }}>Location</Text>
            </View>


            <View style={{ marginTop: 30, flex: 1 }}>
                <Text style={headerStyle}>Location access</Text>
                <View style={{
                    borderBottomWidth: 1,
                    borderColor: colors.fadeTextColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 10,
                    justifyContent: 'space-between',
                    alignSelf: 'flex-start'
                }}>
                    <Text style={{ ...normalTextStyle, flex: 8 }}>Apps that have this permission can get your location info</Text>
                    <View style={{ flex: 2 }}>
                        <Switch
                            trackColor={{ false: '#767577', true: '#abdbe3' }}
                            thumbColor={isEnabled ? colors.switchColor : '#f4f3f4'}
                            onValueChange={() => {
                                toggleSwitch();
                                requestLocationPermission();
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