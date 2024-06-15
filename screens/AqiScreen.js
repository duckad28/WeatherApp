import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    Text,
    TextInput,
    ScrollView,
    ImageBackground
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { LocationItem } from '../components';
import { colors, fontSizes } from '../constants';

const vn = [
    'Tuyệt vời',
    'Vừa phải',
    'Xấu',
    'Có hại',
    'Rất có hại',
    'Nguy hiểm',
    'Chất lượng không lý lý tưởng cho hầu hết đối tượng; hãy tận hưởng các hoạt động ngoài trời bình thường.',
    'Chất lượng không khí mở mức chấp nhận được đối với hầu hết đối tượng. Tuy nhiên, ở các nhóm đối tượng nhạy cảm có thể sẽ xuất hiện triệu chứng từ nhẹ đến trung bình nếu tiếp xúc quá lâu.',
    'Không khí đã đạt mức ô nhiễm cao và không phù hợp với các nhóm đối tượng nhạy cảm. Hãy giảm thời gian ở bên ngoài nếu cơ thể xuất hiện các triệu chứng như khó thở hay ngứa cổ.',
    'Các nhóm đối tượng nhạy cảm có thể cảm nhận được tác động đến sức khỏe ngay lập tức. Các đối tượng khỏe mạnh có thể gặp tình trạng khó thở và ngứa cổ nếu tiếp xúc lâu. Hãy giới hạn hoạt động ngoài trời.',
    'Các nhóm đối tượng nhạy cảm sẽ cảm nhận được tác động đến sức khỏe ngay lập tức và nên tránh hoạt động ngoài trời. Các đối tượng khỏe mạnh nhiều khả năng sẽ gặp tình trạng khó thở và ngứa cổ, hãy cân nhắc việc ở trong nhà và dời lịch cho các hoạt động ngoài trời.',
    'Mọi tiếp xúc với không khí, dù chỉ vài phút, cũng có thể dẫn đến tác động nghiêm trọng đến sức khỏe đối với mọi đối tượng. Hãy tránh các hoạt động ngoài trời.',
    'Vật chất dạng hạt mịn là các hạt ô nhiễm hít được có đường kính dưới 2,5 micro mét có khả năng đi vào trong phổi và dòng máu, gây ra nhiều vấn đề nghiêm trọng về sức khỏe. Tác động nghiêm trọng nhất là ở phổi và tim. Nếu tiếp xúc có thể dẫn đến tình trạng ho hoặc khó thở, làm trầm trọng thêm bệnh hen suyễn và hình thành bệnh đường hô hấp mãn tính.',
    'Vật chất dạng hạt là các hạt ô nhiễm hít được có đường kính dưới 10 micro mét. Các hạt lớn hơn 2,5 micro mét có thể tích tụ trong đường dẫn khí, gây ra nhiều vấn đề về sức khỏe. Nếu tiếp xúc nhiều có thể dẫn đến tình trạng kích ứng mắt và cổ họng, ho hoặc khó thở cũng như làm trầm trọng thêm bệnh hen suyễn. Tiếp xúc quá mức và thường xuyên có thể dẫn đến nhiều tác động nghiêm trọng đến sức khỏe.',
    'Ôzôn mặt đất có thể làm nặng thêm các bệnh về đường hô hấp bị sẵn và cùng có thể dẫn đến tình trạng kích ứng cổ họng, đau đầu và đau ngực.',
    'Tiếp xúc lưu huỳnh điôxít (SO2) có thể dẫn đến tình trạng kích ứng mắt và cổ họng đồng thời làm trầm trọng thêm bệnh hen suyễn và bệnh viêm cuống phổi mãn tính.',
    'Hít thở trong môi trường có điôxít nitơ (NO2) ở mức cao có khả năng tăng nguy cơ gặp vấn đề về đường hô hấp. Các triệu chứng thường gặp là ho và khó thở, còn các vấn đề sức khỏe nghiêm trọng hơn như nhiễm trùng đường hô hấp có thể xuất hiện nếu tiếp xúc trong thời gian dài hơn.',
    'Cacbon monoxit (CO) là khí không màu không mùi và khi hít phải ở mức cao có thể gây ra đau đầu, buồn nôn, chóng mặt và nôn mửa. Tiếp xúc nhiều lần trong thời gian dài có thể dẫn đến bệnh về tim.',
    'Các chất ô nhiễm hiện tại',
    'Thang đo chất lượng không khí',
    'Chất lượng không khí'
]

const en = [
    'Excellent',
    'Fair',
    'Poor',
    'Unhealthy',
    'Very Unhealthy',
    'Dangerous',
    'The air quality is ideal for most individuals, enjoy your normal outdoor activities.',
    'The air quality is generally acceptable for most individuals. However, sensitive groups may experience minor to moderate symptoms from long-term exposure.',
    'The air has reached a high level of pollution and is unhealthy for sensitive groups. Reduce time spent outside if you are feeling symptoms such as difficulty breathing or throat irriation.',
    'Health effects can be immediately felt by sensitive groups. Healthy individuals may experience difficulty breathing and throat irriation with prolonged exposure. Limit outdoor activity.',
    'Health effects can be immediately felt by sensitive groups and should avoid outdoor activity. Healthy individuals are likely to experience difficulty breathing and throat irritation; consider staying indoors and rescheduling outdoor activities.',
    'Any exposure to the air, even for a few minutes, can lead to serious health effects on everybody. Avoid outdoor activies.',
    'Fine Particulate Matter  are inhalable pollutant particles with a diameter less than 2.5 micrometers that can enter the lungs and bloodstream, resulting in serious health issues. The most severe impacts are on the lungs and heart. Exposure can result in coughing or difficulty breathing, aggravated asthma, and the development of chronic respiratory disease.',
    'Particulate Matter  are inhalable pollutant particles with a diameter less than 10 micrometers. Particles that are larger than 2.5 micrometers can be deposited in airways, resulting in health issues. Exposure can result in eye and throat irritation, coughing or difficulty breathing, and aggravated asthma. More frequent and excessive exposure can result in more serious health effects.',
    'Ground-level Ozone  can aggravate existing respiratory diseases and also lead to throat irritation, headaches, and chest pain.',
    'Exposure to Sulfur Dioxide can lead to throat and eye irritation and aggravate asthma as well as chronic bronchitis.',
    'Breathing in high levels of Nitrogen Dioxide  increases the risk of respiratory problems. Coughing and difficulty breathing are common and more serious health issues such as respiratory infections can occur with longer exposure.',
    'Carbon Monoxide is a colorless and odorless gas and when inhaled at high levels can cause headache, nausea, dizziness, and vomiting. Repeated long-term exposure can lead to heart disease.',
    'Current Pollutants',
    'Air Quality Scale',
    'Air Quality Index',
]

const AqiScreen = (props) => {
    const { navigation } = props;
    const { route } = props;
    const data = route.params.data;
    const { navigate } = navigation;
    let lan = route?.params?.lang ? en : vn;
    let image = route?.params?.imageBackground;
    const labels = [
        {
            title: lan[0],
            content: lan[6],
            color: 'cyan',
            value: 1
        },
        {
            title: lan[1],
            content: lan[7],
            color: 'green',
            value: 2,
        },
        {
            title: lan[2],
            content: lan[8],
            color: '#F8E559',
            value: 3,
        },
        {
            title: lan[3],
            content: lan[9],
            color: 'red',
            value: 4,
        },
        {
            title: lan[4],
            content: lan[10],
            color: 'purple',
            value: 5,
        },
        {
            title: lan[5],
            content: lan[11],
            color: 'blue',
            value: 6,
        },
    ]
    const info = [
        {
            name: 'PM2.5',
            content: lan[12],
            val: data?.pm2_5,
            unit: 'μg/m3'
        },
        {
            name: 'PM10',
            content: lan[13],
            val: data?.pm10,
            unit: 'μg/m3'
        },
        {
            name: 'O3',
            content: lan[14],
            val: data?.o3,
            unit: 'μg/m3'
        },
        {
            name: 'SO2',
            content: lan[15],
            val: data?.so2,
            unit: 'μg/m3'
        },
        {
            name: 'NO2',
            content: lan[16],
            val: data?.no2,
            unit: 'μg/m3'
        },
        {
            name: 'CO',
            content: lan[17],
            val: data?.co,
            unit: 'μg/m3'
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
                <TouchableOpacity onPress={() => navigate('MainScreen', {lang: route?.params?.lang, unit: route?.params?.unit})} style={{ height: 40 }}>
                    <FontAwesomeIcon icon={faArrowLeft} size={26}></FontAwesomeIcon>
                </TouchableOpacity>
                <View style={{
                    marginHorizontal: 20,
                    height: 60,
                    justifyContent: 'center'
                }}>
                    <Text style={{ fontSize: 30, color: 'black', textAlignVertical: 'center' }}>{lan[20]}</Text>
                </View>
            </View>

            <View style={{
                height: 240,
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
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: '500',
                        color: colors.textColor
                    }}>
                        {labels[data["us-epa-index"] - 1].title}
                    </Text>
                    <Text style={{
                        fontSize: 10,
                        fontWeight: '500',
                        color: colors.textColor,
                        textAlign: 'center'
                    }}>
                        {labels[data["us-epa-index"] - 1].content}
                    </Text>
                </View>

            </View>
<ImageBackground source={image}
                                    style={{ flex: 1 }}
                                    resizeMode='cover'>
            <ScrollView>
                
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <FlatList data={info}
                        renderItem={({item}) => {
                            return (
                                <View style={{backgroundColor: colors.buttonColor, flexDirection: 'row', padding: 10, borderRadius: 10, marginHorizontal: 20}}>
                                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 10}}>
                                        <Text style={{color: colors.textColor, fontSize: fontSizes.h5}}>{item.name}</Text>
                                        <Text style={{color: colors.fadeTextColor, fontSize: fontSizes.h7}}>{item.content}</Text>
                                    </View>
                                    <View style={{width: 80,flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                                        <Text style={{color: colors.textColor, fontSize: fontSizes.h5}}>{item.val}</Text>
                                        <Text style={{color: colors.fadeTextColor, fontSize: fontSizes.h7}}>{item.unit}</Text>
                                    </View>
                                </View>
                            )
                        }}
                        keyExtractor={(item, index) => index}
                        ItemSeparatorComponent={
                            <View style={{height: 20}}></View>
                        }
                        ListHeaderComponent={
                            <View style={{
                                justifyContent: 'center',
                                margin: 20
                            }}>
                                <Text style={{
                                    color: colors.textColor,
                                    fontSize: fontSizes.h5
                                }}>{lan[18]}</Text>
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                        >

                    </FlatList>
                </View>
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <FlatList data={labels}
                        renderItem={({ item }) => {
                            return <Label item={item}></Label>
                        }}
                        keyExtractor={item => item.title}
                        ListHeaderComponent={
                            <View style={{
                                justifyContent: 'center',
                                margin: 20
                            }}>
                                <Text style={{
                                    color: colors.textColor,
                                    fontSize: fontSizes.h5
                                }}>{lan[19]}</Text>
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                    ></FlatList>

                </View>
                
            </ScrollView>
</ImageBackground>
        </View>

    )
}

const Label = (props) => {
    const { title, content, color, value } = props.item;
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
                <View style={{ width: 40, height: 4, backgroundColor: color, }}></View>
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
                <Text style={{ color: colors.textColor, fontSize: 40, fontWeight: '600', alignSelf: 'flex-end' }}>{value}</Text>
            </View>
        </View>
    )
}

export default AqiScreen;