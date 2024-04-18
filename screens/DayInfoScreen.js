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

const DayInfoScreen = (props) => {
    let {isVisible, setVisible} = props;
    let data = {
        date: '15/04/2024',
        dayOfWeeks: 'Monday',
        highestTemp: 30,
        lowestTemp: 24,
    }
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
                        <Text style={headerStyle}>{data.dayOfWeeks}</Text>
                        <Text style={normalTextStyle}>{data.date}</Text>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20
                    }}>
                        <Temperature highest={data.highestTemp} lowest={data.lowestTemp} fontSize={fontSizes.h1}></Temperature>
                        <Text>Clear, hot and humid</Text>
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

const dayInfoData = [
    {
        name: 'RealFeel high',
        value: 39
    },
    {
        name: 'RealFeel low',
        value: 25
    },
    {
        name: 'RealFeel Shade high',
        value: 35
    },
    {
        name: 'AQI',
        value: 50
    },
    {
        name: 'Max UV Index',
        value: 1
    },
    {
        name: 'average wind',
        value: '17km/h'
    },
    {
        name: 'rain probability',
        value: '37%'
    },
    {
        name: 'max wind gust',
        value: '26km/h'
    },
    {
        name: 'Average cloud cover',
        value: '5%'
    }
]

const Temperature = (props) => {
    let {highest, lowest, fontSize} = props;
    return (
        <View style={{
            flexDirection: 'row',
        }}>

            <Text style={{color: 'black', fontSize: fontSize}}>{highest}</Text>
            <View style={{
            }}>
                <Text style={{ position: 'absolute', top: 0, fontSize: fontSize/2, color: 'black' }}>o</Text>
            </View>

            <Text style={{
                paddingLeft: fontSize/4,
                marginHorizontal: fontSize/4,
                color: 'black', fontSize: fontSize
            }}> </Text>

            <Text style={{color: 'black', fontSize: fontSize}}>{lowest}</Text>
            <View style={{
                width: 10
            }}>
                <Text style={{ position: 'absolute', top: 0, fontSize: fontSize/2, color: 'black' }}>o</Text>
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