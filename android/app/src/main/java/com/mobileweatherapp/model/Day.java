package com.mobileweatherapp.model;

public class Day {
    private float avgtemp_c;
    private float mintemp_c;
    private ConditionDay condition;

    public Day(float avgtemp_c, float mintemp_c, ConditionDay condition) {
        this.avgtemp_c = avgtemp_c;
        this.mintemp_c = mintemp_c;
        this.condition = condition;
    }

    public float getAvgtemp_c() {
        return avgtemp_c;
    }

    public void setAvgtemp_c(float avgtemp_c) {
        this.avgtemp_c = avgtemp_c;
    }

    public float getMintemp_c() {
        return mintemp_c;
    }

    public void setMintemp_c(float mintemp_c) {
        this.mintemp_c = mintemp_c;
    }

    public ConditionDay getConditionDay() {
        return condition;
    }

    public void setConditionDay(ConditionDay condition) {
        this.condition = condition;
    }
}
