import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const WeatherForecast = () => {
  const screenWidth = Dimensions.get('window').width;

  const data = {
    labels: ["5/16", "5/17", "5/18", "5/19", "5/20"],
    datasets: [
      {
        data: [31, 30, 31, 32, 30],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Temperature °C"] // optional
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  const weatherData = [
    { day: "Today", date: "5/16", tempMax: 31, tempMin: 23, icon: "⛈", wind: "Force 2" },
    { day: "Tomorrow", date: "5/17", tempMax: 30, tempMin: 24, icon: "☁️", wind: "Force 2" },
    { day: "Sat", date: "5/18", tempMax: 31, tempMin: 25, icon: "⛅", wind: "Force 2" },
    { day: "Sun", date: "5/19", tempMax: 32, tempMin: 24, icon: "🌦", wind: "Force 2" },
    { day: "Mon", date: "5/20", tempMax: 30, tempMin: 24, icon: "☁️", wind: "Force 2" }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>5-day forecast</Text>
      <LineChart
        data={data}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
      {weatherData.map((item, index) => (
        <View key={index} style={styles.dayContainer}>
          <Text style={styles.dayText}>{item.day}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.tempText}>{item.tempMax}°</Text>
          <Text style={styles.tempText}>{item.tempMin}°</Text>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.wind}>{item.wind}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16
  },
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  dateText: {
    fontSize: 14,
    color: '#666'
  },
  tempText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  icon: {
    fontSize: 16
  },
  wind: {
    fontSize: 14,
    color: '#666'
  }
});

export default WeatherForecast;
