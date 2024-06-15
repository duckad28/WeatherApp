package com.mobileweatherapp.api;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mobileweatherapp.model.Currency;

import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface ApiService {

    //https://api.weatherapi.com/v1/forecast.json?key=&q=Ha%20noi&days=7
    Gson gson = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd HH:mm")
            .create();

    ApiService apiService = new Retrofit.Builder()
            .baseUrl("https://api.weatherapi.com/")
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
            .create(ApiService.class);

    @GET("v1/forecast.json")
    Call<Currency> getDataAPI(@Query("key") String key,
                              @Query("q") String q,
                              @Query("days") int days);

}
