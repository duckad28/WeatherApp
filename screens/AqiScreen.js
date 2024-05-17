import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    Text,
    TextInput,
    ScrollView
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { LocationItem } from '../components';
import { colors, fontSizes } from '../constants';

const AqiScreen = (props) => {
    const { navigation } = props;
    const {route} = props;
    const data = route.params.data;
    const { navigate } = navigation;
    const [searchText, setSearchText] = useState('');
    const labels = [
        {
            title : 'Excellent',
            content: 'The air quality is ideal for most individuals, enjoy your normal outdoor activities.',
            color: 'cyan',
            value: 1
        },
        {
            title: 'Fair',
            content: 'The air quality is generally acceptable for most individuals. However, sensitive groups may experience minor to moderate symptoms from long-term exposure.',
            color: 'green',
            value: 2,
        },
        {
            title: 'Poor',
            content: 'The air has reached a high level of pollution and is unhealthy for sensitive groups. Reduce time spent outside if you are feeling symptoms such as difficulty breathing or throat irriation.',
            color: '#F8E559',
            value: 3,
        },
        {
            title: 'Unhealthy',
            content: 'Health effects can be immediately felt by sensitive groups. Healthy individuals may experience difficulty breathing and throat irriation with prolonged exposure. Limit outdoor activity.',
            color: 'red',
            value: 4,
        },
        {
            title: 'Very Unhealthy',
            content: 'Health effects can be immediately felt by sensitive groups and should avoid outdoor activity. Healthy individuals are likely to experience difficulty breathing and throat irritation; consider staying indoors and rescheduling outdoor activities.',
            color: 'purple',
            value: 5, 
        },
        {
            title: 'Dangerous',
            content: 'Any exposure to the air, even for a few minutes, can lead to serious health effects on everybody. Avoid outdoor activies.',
            color: 'blue',
            value: 6,
        },
    ]
    return (
        <View style={{
            backgroundColor: 'white',
            flex: 1
        }}>
            <View style={{
                backgroundColor: 'white',
                marginHorizontal: 10,
                marginVertical: 10
                }}>
                <TouchableOpacity onPress={() => navigate('MainScreen')} style={{ height: 40 }}>
                    <FontAwesomeIcon icon={faArrowLeft} size={26}></FontAwesomeIcon>
                </TouchableOpacity>
                <View style={{
                    marginHorizontal: 20,
                    height: 60,
                    justifyContent: 'center'
                    }}>
                    <Text style={{ fontSize: 30, color: 'black', textAlignVertical: 'center' }}>Air Quality Index</Text>
                </View>
            </View>

            <View style = {{
                height: 200,
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: labels[data["us-epa-index"] - 1].color,
            }}>
                <View>
                    <Text style={{
                        fontSize: 100,
                        fontWeight: '700',
                        color: colors.textColor
                    }}>
                        {data["us-epa-index"]}
                    </Text>
                </View>
                
                
            </View>
            
            <ScrollView>
            <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: '#31304D'
                }}>
                <FlatList data={labels}
                renderItem={({item}) => {
                    return <Label item = {item}></Label>
                }}
                keyExtractor={item => item.title}
                ListHeaderComponent={
                <View style={{
                    justifyContent: 'center',
                    margin : 20
                }}>
                    <Text style={{
                        color: colors.textColor,
                        fontSize: fontSizes.h5
                    }}>Air Quality Scale</Text>
                </View>
                }
                showsVerticalScrollIndicator={false}
                ></FlatList>

                </View>
            </ScrollView>
            
        </View>

    )
}

const Label = (props) => {
    const {title, content, color, value} = props.item;
    return (
        <View style={{
            marginHorizontal: 20,
            paddingVertical: 15,
            flexDirection: 'row',
            justifyContent: 'flex-start'
        }}>
            
            <View style={{
                flex: 7,
                rowGap: 10
            }}>
                <View style={{width: 40, height: 4, backgroundColor: color,}}></View>
                <Text style={{
                    color: colors.textColor,
                    textAlignVertical: 'center',
                    fontSize: fontSizes.h5
                }}>{title}</Text>
                <Text style={{
                    color: colors.textColor,
                    textAlignVertical: 'center',
                    fontSize: fontSizes.h7
                }}>{content}</Text>
            </View>

            <View style={{
                flex: 3,
                
                justifyContent: 'flex-start',
                alignContent: 'flex-start'
            }}>
                <Text style = {{color: colors.textColor,fontSize: 40, fontWeight: '600', alignSelf: 'flex-end'}}>{value}</Text>
            </View>
        </View>
    )
}

export default AqiScreen;