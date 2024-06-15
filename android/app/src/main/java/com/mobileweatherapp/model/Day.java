package com.mobileweatherapp.model;

public class Day {
    private float maxtemp_c;
    private float mintemp_c;
    private ConditionDay condition;

    public Day(float maxtemp_c, float mintemp_c, ConditionDay condition) {
        this.maxtemp_c = maxtemp_c;
        this.mintemp_c = mintemp_c;
        this.condition = condition;
    }

    public float getMaxtemp_c() {
        return maxtemp_c;
    }

    public void setMaxtemp_c(float maxtemp_c) {
        this.maxtemp_c = maxtemp_c;
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
