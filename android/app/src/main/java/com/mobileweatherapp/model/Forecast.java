package com.mobileweatherapp.model;

import java.util.ArrayList;
import java.util.List;

public class Forecast {
    private ArrayList<ForecastDay> forecastday;

    public Forecast(ArrayList<ForecastDay> forecastday) {
        this.forecastday = forecastday;
    }

    public ArrayList<ForecastDay> getForecastday() {
        return forecastday;
    }

    public void setForecastday(ArrayList<ForecastDay> forecastday) {
        this.forecastday = forecastday;
    }
}
