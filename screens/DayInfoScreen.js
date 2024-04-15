import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Modal,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { colors, fontSizes } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCross, faMoon, faMultiply, faSun, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

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
                        <View style={{
                            height: 40,
                            borderBottomWidth: 1,
                            borderColor: colors.fadeTextColor,
                            flexDirection: 'row',
                            alignItems: 'center',
                            margin: 10,
                            justifyContent: 'space-between'
                        }}>
                            <Text style={normalTextStyle}>RealFeel High</Text>
                            <Text>39</Text>

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
                            <Text style={normalTextStyle}>RealFeel Low</Text>
                            <Text>24</Text>

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
                            <Text style={normalTextStyle}>RealFeel Shade High</Text>
                            <Text>37</Text>

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
                            <Text style={normalTextStyle}>AQI</Text>
                            <Text>39</Text>

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
                            <Text style={normalTextStyle}>Max UV Index</Text>
                            <Text>4</Text>

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
                            <Text style={normalTextStyle}>Average Wind</Text>
                            <Text>SSE 17km/h</Text>

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
                            <Text style={normalTextStyle}>Max Wind Gusts</Text>
                            <Text>26km/h</Text>

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
                            <Text style={normalTextStyle}>Rain Probability</Text>
                            <Text>9%</Text>

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
                            <Text style={normalTextStyle}>Average Cloudy Cover</Text>
                            <Text>50%</Text>

                        </View>

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
const textStyle = StyleSheet.create({
    color: colors.textColor, fontSize: fontSizes.h5, textAlignVertical: 'center'
})

export default DayInfoScreen;