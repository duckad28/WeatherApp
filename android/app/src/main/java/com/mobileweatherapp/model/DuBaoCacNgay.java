package com.mobileweatherapp.model;

public class DuBaoCacNgay {
    private String date;
    private Day day;

    public DuBaoCacNgay(String date, Day day) {
        this.date = date;
        this.day = day;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Day getDay() {
        return day;
    }

    public void setDay(Day day) {
        this.day = day;
    }
}
