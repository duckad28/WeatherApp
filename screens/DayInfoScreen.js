import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Modal,
    TouchableOpacity,
    StyleSheet,
    FlatList
} from 'react-native';
import { colors, fontSizes } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCross, faMoon, faMultiply, faSun, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ExtraInfoItem } from '../components';

const dayOfWeeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const getDayOfWeek = (day) => {
    let t = new Date(day);
    return dayOfWeeks[t.getDay()];
}

const DayInfoScreen = (props) => {
    let weatherData = props.data;
    let {dt_txt, main , weather, rain} = weatherData
    let {isVisible, setVisible} = props;
    let data = {
        date: '15/04/2024',
        dayOfWeeks: 'Monday',
        highestTemp: 30,
        lowestTemp: 24,
    }
    const dayInfoData = [
        {
            name: 'RealFeel high',
            value: Math.round(main.temp_max)
        },
        {
            name: 'RealFeel low',
            value: Math.round(main.temp_min)
        },
        {
            name: 'RealFeel',
            value: Math.round(main.temp)
        },
        {
            name: 'Humidity',
            value: main.humidity
        },
        {
            name: 'Cloud',
            value: weatherData.clouds.all + "%"
        },
        {
            name: 'Wind speed',
            value: weatherData.wind.speed
        },
        {
            name: 'Wind degree',
            value: weatherData.wind.deg
        },
        {
            name: 'Wind gust',
            value: weatherData.wind.gust
        },
        {
            name: 'Visibility',
            value: weatherData.visibility
        }
    ]
    
    let highestTemp = Math.round(main.temp_max);
    let lowestTemp = Math.round(main.temp_min);
    return (
        <Modal visible={isVisible} transparent={true} animationType='slide'>
            <View style = {{
            flex: 1
        }}>
                <View style={{
                    height: 120
                }}>

                </View>


                <View style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    paddingHorizontal: 20
                }}>
                    <TouchableOpacity onPress={()=>setVisible(false)} onS style={{alignSelf: 'center', margin: 10}}>
                        <View style={{
                            width: 60,
                            height: 10,
                            backgroundColor: colors.backgroundColor,
                            borderRadius: 5
                        }}>

                        </View>
                    </TouchableOpacity>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={headerStyle}>{getDayOfWeek(dt_txt)}</Text>
                        <Text style={normalTextStyle}>{dt_txt}</Text>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20
                    }}>
                        <Temperature highest={Math.round(main.temp_max)} lowest={Math.round(main.temp_min)} fontSize={fontSizes.h1}></Temperature>
                        <Text>{weatherData.weather[0].description}</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <FlatList 
                        data={dayInfoData}
                        renderItem={({item}) => {
                            return <ExtraInfoItem data = {item} height = {40} nameStyle={nameTextStyle} valueStyle = {valueTextStyle}></ExtraInfoItem>
                        }}
                        keyExtractor={item => item.name}></FlatList>

                        <View style={{
                            height: 120,
                            borderBottomWidth: 1,
                            borderColor: colors.fadeTextColor,
                            flexDirection: 'row',
                            alignItems: 'center',
                            margin: 10,
                            justifyContent: 'space-between'
                        }}>
                            <View style={{flex: 1, padding: 10, borderWidth: 1,
                            borderColor: colors.fadeTextColor,}}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faSun} size={24}></FontAwesomeIcon>
                                    <View>
                                        <Text>12 hrs</Text>
                                        <Text>38 mins</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>Rise</Text>
                                    <Text>05:38 AM</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>Set</Text>
                                    <Text>06:16 PM</Text>
                                </View>
                            </View>
                            
                            <View style={{flex: 1, padding: 10, borderWidth: 1,
                            borderColor: colors.fadeTextColor,}}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faMoon} size={24}></FontAwesomeIcon>
                                    <View>
                                        <Text>13 hrs</Text>
                                        <Text>57 mins</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>Rise</Text>
                                    <Text>10:58 AM</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>Set</Text>
                                    <Text>12:56 AM</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
        
    )
}



const Temperature = (props) => {
    let {highest, lowest, fontSize} = props;
    return (
        <View style={{
            flexDirection: 'row',
        }}>

            <Text style={{color: 'black', fontSize: fontSize, textAlignVertical: 'bottom'}}>{highest}</Text>

            <View style={{
            }}>
                <Text style={{ position: 'absolute', top: 0, fontSize: fontSize/2, color: 'black' }}>o</Text>
            </View>

            <Text style={{
                paddingLeft: fontSize/4,
                marginHorizontal: fontSize/4,
                color: 'black', fontSize: fontSize
            }}> </Text>

            <Text style={{color: 'black', textAlignVertical: 'bottom', fontSize: fontSize*0.8}}>{lowest}</Text>
            <View style={{
                width: 10
            }}>
                <Text style={{ position: 'absolute', top: fontSize*0.3, fontSize: fontSize/3, color: 'black' }}>o</Text>
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
    fontSize: fontSizes.h6,
    color: colors.fadeBlackTextColor,
    fontWeight: '400',
    textAlignVertical: 'center',

})
const nameTextStyle = StyleSheet.create({
    fontSize: fontSizes.h5,
    color: colors.blackTextColor,
    fontWeight: '400',
    textAlignVertical: 'center',

})
const valueTextStyle = StyleSheet.create({
    fontSize: fontSizes.h6,
    color: colors.fadeBlackTextColor,
    fontWeight: '400',
    textAlignVertical: 'center',

})
const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})

export default DayInfoScreen;