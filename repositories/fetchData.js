import axios from "axios";



const locationSuggestEndpoint = params => `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;
const forecastEndpoint = params => `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=7&aqi=yes&alerts=no`;
const coordEndpoint = params => `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.lat},${params.lon}&days=7&aqi=yes&alerts=no`;
const geoEndpoint = params => `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${params.lat},${params.long}&lang=en-EN&apiKey=`;
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

export const fetchForecastCoord = params => {
    return apiCall(coordEndpoint(params));
}