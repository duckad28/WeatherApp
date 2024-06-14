package com.mobileweatherapp;

import android.annotation.SuppressLint;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.widget.ImageView;
import android.widget.RemoteViews;
import android.widget.TextView;
import android.widget.Toast;
import android.app.PendingIntent;
import android.content.Intent;

import com.bumptech.glide.Glide;
import com.mobileweatherapp.api.ApiService;
import com.mobileweatherapp.model.Currency;

import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.text.DateFormat;
import java.util.Date;
import java.util.Objects;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Implementation of App Widget functionality.
 */
public class WeatherWidget extends AppWidgetProvider {

    private static String tvTempC;
    private static String tvHumidity;
    private static String tvCondition;
    private static int isDay;
    private static ImageView imgFromApi;


    @SuppressLint("StringFormatInvalid")
    static void updateAppWidget(Context context,
                                AppWidgetManager appWidgetManager,
                                int appWidgetId) {

        try {
            String timeString =
                    DateFormat.getTimeInstance(DateFormat.SHORT).format(new Date());
            SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
            String appString = sharedPref.getString("appData", "{\"text\":'no data'}");
            JSONObject appData = new JSONObject(appString);
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.weather_widget);
//Thay doi textview dia diem
            views.setTextViewText(R.id.place, context.getResources().getString(R.string.text_condition, appData.getString("text")));
            int imgId = setImg(tvCondition);
            views.setImageViewResource(R.id.imageView, imgId);
//Thay doi textview thoi gian//
            views.setTextViewText(R.id.time_update,
                    context.getResources().getString(
                            R.string.time, timeString));
            //Toast.makeText(context, timeString, Toast.LENGTH_SHORT).show();
//Thay doi textview trang thai, nhiet do//
            views.setTextViewText(R.id.condition, context.getResources().getString(R.string.text_condition, tvCondition));
            views.setTextViewText(R.id.temperature,
                    context.getResources().getString(
                            R.string.text_temperature, tvTempC) + "°C");
//Thay doi textview do am//
            views.setTextViewText(R.id.humidity,"Humidity: "+
                    context.getResources().getString(R.string.text_humidity, tvHumidity)+"%");
            Intent intentUpdate = new Intent(context, WeatherWidget.class);
            intentUpdate.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            int[] idArray = new int[]{appWidgetId};
            intentUpdate.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, idArray);
            PendingIntent pendingUpdate = PendingIntent.getBroadcast(
                    context, appWidgetId, intentUpdate,
                    PendingIntent.FLAG_UPDATE_CURRENT);
            Intent intentOpenApp = new Intent(context, MainActivity.class);
            PendingIntent pendingOpenApp = PendingIntent.getActivity(context, 0, intentOpenApp, PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.time_update, pendingUpdate);
            views.setOnClickPendingIntent(R.id.imageView3, pendingUpdate);
            views.setOnClickPendingIntent(R.id.place, pendingOpenApp);
            views.setOnClickPendingIntent(R.id.imageView, pendingOpenApp);
            views.setOnClickPendingIntent(R.id.humidity, pendingOpenApp);
            views.setOnClickPendingIntent(R.id.temperature, pendingOpenApp);
            views.setOnClickPendingIntent(R.id.layout, pendingOpenApp);
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }catch (JSONException e) {
            e.printStackTrace();
        }
    }
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            callApi(context);
            updateAppWidget(context, appWidgetManager, appWidgetId);
            //Toast.makeText(context, "Widget has been updated! ", Toast.LENGTH_SHORT).show();
        }
    }

    //https://api.weatherapi.com/v1/current.json?key=9a9dcb14233e4d9aad5142530242004&q=%22Ha%20Noi%22
    static void callApi(Context context) {
        ApiService.apiService.getDataAPI("9a9dcb14233e4d9aad5142530242004", "Ha Noi", "yes").enqueue(new Callback<Currency>() {
            @Override
            public void onResponse(Call<Currency> call, Response<Currency> response) {
                //Toast.makeText(context, "Call API success! ", Toast.LENGTH_SHORT).show();

                Currency currency = response.body();
                if(currency != null) {
                    isDay = Integer.parseInt(String.valueOf(currency.getCurrent().getIs_day()));
                    tvTempC =  String.valueOf(Math.round(currency.getCurrent().getTemp_c()));
                    tvHumidity = String.valueOf(Math.round(currency.getCurrent().getHumidity()));
                    tvCondition = String.valueOf(currency.getCurrent().getCondition().getText());
                    //Glide.with(context).load("https:" + currency.getCurrent().getCondition().getIcon()).into(imgFromApi);
                }
                //Toast.makeText(context, tvTempC, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailure(Call<Currency> call, Throwable throwable) {
                //Toast.makeText(context, "Call API error! ", Toast.LENGTH_SHORT).show();
            }
        });
    }

    static int setImg(String condition){
        int idImg;
        condition = tvCondition;
        if(isDay==1){
            if(Objects.equals(tvCondition, "Partly cloudy")){
                idImg = R.drawable.partly_cloudy_day;
            } else if (Objects.equals(tvCondition, "Moderate or heavy rain with thunder")) {
                idImg = R.drawable.moderate_or_heavy_rain_with_thunder;
            } else if (Objects.equals(tvCondition, "Patchy light rain with thunder")) {
                idImg = R.drawable.patchy_light_rain_with_thunder_day;
            } else if (Objects.equals(tvCondition, "Clear")){
                idImg = R.drawable.clear_day;
            } else if (Objects.equals(tvCondition, "Light rain shower")){
                idImg = R.drawable.light_rain_shower_day;
            } else if (Objects.equals(tvCondition, "Sunny")){
                idImg = R.drawable.sunny;
            } else if (Objects.equals(tvCondition, "Patchy rain nearby")){
                idImg = R.drawable.patchy_rain_nearby;
            } else {
                idImg = R.drawable.overcast;
            }
        } else {
            if(Objects.equals(tvCondition, "Partly cloudy")){
                idImg = R.drawable.partly_cloudy_night;
            } else if (Objects.equals(tvCondition, "Moderate or heavy rain with thunder")) {
                idImg = R.drawable.moderate_or_heavy_rain_with_thunder;
            } else if (Objects.equals(tvCondition, "Patchy light rain with thunder")) {
                idImg = R.drawable.patchy_light_rain_with_thunder_night;
            } else if (Objects.equals(tvCondition, "Clear")){
                idImg = R.drawable.clear_night;
            } else if (Objects.equals(tvCondition, "Light rain shower")){
                idImg = R.drawable.light_rain_shower_night;
            } else if (Objects.equals(tvCondition, "Patchy rain nearby")){
                idImg = R.drawable.light_rain_shower_night;
            } else {
                idImg = R.drawable.overcast;
            }
        }
        return idImg;
    }
}