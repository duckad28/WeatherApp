import axios from "axios";

const locationSuggestEndpoint = params => `http://api.weatherapi.com/v1/search.json?key=9a9dcb14233e4d9aad5142530242004&q=${params.cityName}`;
const forecastEndpoint = params => `http://api.weatherapi.com/v1/forecast.json?key=9a9dcb14233e4d9aad5142530242004&q=${params.cityName}&days=7&aqi=yes&alerts=no`;
const dailyForecastEndpoint = params => `https://api.openweathermap.org/data/2.5/forecast?appid=a0a98d5889ad778265da6a7a517a082a&q=${params.cityName}&units=${params.unit}`;
const currentForecastEndpoint = params => `https://api.openweathermap.org/data/2.5/weather?appid=a0a98d5889ad778265da6a7a517a082a&q=${params.cityName}&units=${params.unit}`;
const geoEndpoint = params => `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${params.lat},${params.long}&lang=vi-VI&apiKey=TRDm5IbmNOYHbJTMzgZe7KpozT9EZOMYNt2VFTu3Fos`;


const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }

    try {
        const response = await axios.request(options);
        return response.data;
    }
    catch (error) {
        return null
    }
}

export const fetchSuggestLocation = params => {
    return apiCall(locationSuggestEndpoint(params));
}


export const fetchForecast = params => {
    return apiCall(forecastEndpoint(params));
}


export const fetchDailyForecast = params => {
    return apiCall(dailyForecastEndpoint(params));
}


export const fetchCurrent = params => {
    return apiCall(currentForecastEndpoint(params));
}

export const fetchGeo = params => {
    return apiCall(geoEndpoint(params));
}