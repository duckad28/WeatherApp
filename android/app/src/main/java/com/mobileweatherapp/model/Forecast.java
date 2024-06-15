package com.mobileweatherapp.model;

import java.util.ArrayList;
import java.util.List;

public class Forecast {
    private List<DuBaoCacNgay> forecastday;

    public Forecast(List<DuBaoCacNgay> forecastday) {
        this.forecastday = forecastday;
    }

    public List<DuBaoCacNgay> getForecastDay() {
        return forecastday;
    }

    public void setForecastDay(List<DuBaoCacNgay> forecastday) {
        this.forecastday = forecastday;
    }
}
