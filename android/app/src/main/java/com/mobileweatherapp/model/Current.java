package com.mobileweatherapp.model;

public class Current {
    private float temp_c;
    private int is_day;
    private float humidity;
    private Condition condition;
    private float feelslike_c;

    public Current(float temp_c, int is_day, float humidity, Condition condition, float feelslike_c) {
        this.temp_c = temp_c;
        this.is_day = is_day;
        this.humidity = humidity;
        this.condition = condition;
        this.feelslike_c = feelslike_c;
    }

    public float getTemp_c() {
        return temp_c;
    }

    public void setTemp_c(float temp_c) {
        this.temp_c = temp_c;
    }

    public float getHumidity() {
        return humidity;
    }

    public void setHumidity(float humidity) {
        this.humidity = humidity;
    }

    public Condition getCondition() {
        return condition;
    }

    public void setCondition(Condition condition) {
        this.condition = condition;
    }

    public int getIs_day() {
        return is_day;
    }

    public void setIs_day(int is_day) {
        this.is_day = is_day;
    }

    public float getFeelslike_c() {
        return feelslike_c;
    }

    public void setFeelslike_c(float feelslike_c) {
        this.feelslike_c = feelslike_c;
    }
}
