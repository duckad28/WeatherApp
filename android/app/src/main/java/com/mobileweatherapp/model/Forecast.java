package com.mobileweatherapp.model;

import java.util.ArrayList;
import java.util.List;

public class Forecast {
    private List<ForecastDay> forecastday;

    public Forecast(List<ForecastDay> forecastday) {
        this.forecastday = forecastday;
    }

    public List<ForecastDay> getForecastDay() {
        return forecastday;
    }

    public void setForecastDay(List<ForecastDay> forecastday) {
        this.forecastday = forecastday;
    }
}
