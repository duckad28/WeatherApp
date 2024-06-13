import axios from "axios";

const apiKey = '7c087e009aa9405791065629241206';

const locationSuggestEndpoint = params => `http://api.weatherapi.com/v1/search.json?key=9a9dcb14233e4d9aad5142530242004&q=${params.cityName}`;
const forecastEndpoint = params => `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=7&aqi=yes&alerts=no`;
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

export const fetchGeo = params => {
    return apiCall(geoEndpoint(params));
}