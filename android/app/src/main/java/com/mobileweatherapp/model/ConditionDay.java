package com.mobileweatherapp.model;

public class ConditionDay {
    private String text;
    private String icon;

    public ConditionDay(String text, String icon) {
        this.text = text;
        this.icon = icon;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
