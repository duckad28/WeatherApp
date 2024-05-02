import axios from "axios";
const apiKey = 'a0a98d5889ad778265da6a7a517a082a';
const cityName = 'Ha Noi';
const unit = 'metric';
const urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;
const getCurrentWeather = async () => {
    try {
        const response = await axios.get(urlApi);
        const data = await response.data;
        return data.name;
    } catch(error) {
        alert("got error: " + error.message);
    }
        
    
}

export default {
    getCurrentWeather
};