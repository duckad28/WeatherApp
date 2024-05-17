import axios from "axios";
const getCurrentWeather = async (cityName) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?appid=a0a98d5889ad778265da6a7a517a082a&q=${cityName}&units=metric`);
        const data = await response.data;
        return data;
    } catch (error) {

    }
    
}

const getAqiData = async (cityName) => {
    await fetch(`http://api.weatherapi.com/v1/forecast.json?key=9a9dcb14233e4d9aad5142530242004&q=${cityName}&days=3&aqi=yes&alerts=no`)
            .then((response) => response.json())
            .then((data) => {return data})
            .catch((error) => {
                console.log("Error while fetching data")
            })
}

const getDailyForecast = async(cityName) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?appid=a0a98d5889ad778265da6a7a517a082a&q=${cityName}&units=metric`);
        const data = await response.data;
        return data;
    }
    catch (e) {

    }
}

export {
    getCurrentWeather,
    getAqiData,
    getDailyForecast
}