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
import com.mobileweatherapp.model.DuBaoCacNgay;

import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Objects;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Implementation of App Widget functionality.
 */
public class WeatherWidget2 extends AppWidgetProvider {

    private static String tTempC;
    private static int size;
    private static String tTempC1;
    private static String tTempC2;
    private static String tTempC3;
    private static String tTempC4;
    private static String tTempC5;
    private static String tTempC6;
    private static String tCondition1;
    private static String tCondition2;
    private static String tCondition3;
    private static String tCondition4;
    private static String tCondition5;
    private static String tCondition6;


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
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.weather_widget2);
//Thay doi textview dia diem
            views.setTextViewText(R.id.place, context.getResources().getString(R.string.text_condition, appData.getString("text")));
//Thay doi image
            views.setImageViewResource(R.id.imageView4, setImg(tCondition1));
            views.setImageViewResource(R.id.imageView5, setImg(tCondition2));
            views.setImageViewResource(R.id.imageView6, setImg(tCondition3));
            views.setImageViewResource(R.id.imageView7, setImg(tCondition4));
            views.setImageViewResource(R.id.imageView8, setImg(tCondition5));
            views.setImageViewResource(R.id.imageView9, setImg(tCondition6));
//Thay doi textview thoi gian//
            views.setTextViewText(R.id.time_update,
                    context.getResources().getString(
                            R.string.time, timeString));
            //Toast.makeText(context, timeString, Toast.LENGTH_SHORT).show();
//Thay doi textview trang thai, nhiet do//
            views.setTextViewText(R.id.temperature,
                    context.getResources().getString(
                            R.string.text_temperature, tTempC) + "°C");
            views.setTextViewText(R.id.temperature4,
                    context.getResources().getString(
                            R.string.text_temperature1, tTempC1) + "°");
            views.setTextViewText(R.id.temperature5,
                    context.getResources().getString(
                            R.string.text_temperature2, tTempC2) + "°");
            views.setTextViewText(R.id.temperature6,
                    context.getResources().getString(
                            R.string.text_temperature3, tTempC3) + "°");
            views.setTextViewText(R.id.temperature7,
                    context.getResources().getString(
                            R.string.text_temperature4, tTempC4) + "°");
            views.setTextViewText(R.id.temperature8,
                    context.getResources().getString(
                            R.string.text_temperature5, tTempC5) + "°");
            views.setTextViewText(R.id.temperature9,
                    context.getResources().getString(
                            R.string.text_temperature6, tTempC6) + "°");
            Intent intentUpdate = new Intent(context, WeatherWidget2.class);
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
        }
    }

    //https://api.weatherapi.com/v1/forecast.json?key=&q=Ha%20noi&days=7
    static void callApi(Context context) {
        ApiService.apiService.getDataAPI("", "Ha noi", 7).enqueue(new Callback<Currency>() {
            @Override
            public void onResponse(Call<Currency> call, Response<Currency> response) {
                Currency currency1 = response.body();
                if(currency1 != null) {
                    tTempC = String.valueOf(Math.round(currency1.getCurrent().getTemp_c()));
                    size = currency1.getForecast().getForecastDay().size();
                    tTempC1 = String.valueOf(Math.round(currency1.getForecast().getForecastDay().get(1).getDay().getAvgtemp_c()));
                    tCondition1 = String.valueOf(currency1.getForecast().getForecastDay().get(1).getDay().getConditionDay().getText());
                    tTempC2 = String.valueOf(Math.round(currency1.getForecast().getForecastDay().get(2).getDay().getAvgtemp_c()));
                    tCondition2 = String.valueOf(currency1.getForecast().getForecastDay().get(2).getDay().getConditionDay().getText());
                    tTempC3 = String.valueOf(Math.round(currency1.getForecast().getForecastDay().get(3).getDay().getAvgtemp_c()));
                    tCondition3 = String.valueOf(currency1.getForecast().getForecastDay().get(3).getDay().getConditionDay().getText());
                    tTempC4 = String.valueOf(Math.round(currency1.getForecast().getForecastDay().get(4).getDay().getAvgtemp_c()));
                    tCondition4 = String.valueOf(currency1.getForecast().getForecastDay().get(4).getDay().getConditionDay().getText());
                    tTempC5 = String.valueOf(Math.round(currency1.getForecast().getForecastDay().get(5).getDay().getAvgtemp_c()));
                    tCondition5 = String.valueOf(currency1.getForecast().getForecastDay().get(5).getDay().getConditionDay().getText());
                    tTempC6 = String.valueOf(Math.round(currency1.getForecast().getForecastDay().get(6).getDay().getAvgtemp_c()));
                    tCondition6 = String.valueOf(currency1.getForecast().getForecastDay().get(6).getDay().getConditionDay().getText());
                    //Glide.with(context).load("https:" + currency.getCurrent().getCondition().getIcon()).into(imgFromApi);
                }
            }

            @Override
            public void onFailure(Call<Currency> call, Throwable throwable) {
                //Toast.makeText(context, "Call API error! ", Toast.LENGTH_SHORT).show();
            }
        });
    }

    static int setImg(String condition){
        int idImg;
            if(Objects.equals(condition, "Partly cloudy")){
                idImg = R.drawable.partly_cloudy_day;
            } else if (Objects.equals(condition, "Moderate or heavy rain with thunder")) {
                idImg = R.drawable.moderate_or_heavy_rain_with_thunder;
            } else if (Objects.equals(condition, "Patchy light rain with thunder")) {
                idImg = R.drawable.patchy_light_rain_with_thunder_day;
            } else if (Objects.equals(condition, "Clear")){
                idImg = R.drawable.clear_day;
            } else if (Objects.equals(condition, "Light rain shower")){
                idImg = R.drawable.light_rain_shower_day;
            } else if (Objects.equals(condition, "Sunny")){
                idImg = R.drawable.sunny;
            } else if (Objects.equals(condition, "Patchy rain nearby")){
                idImg = R.drawable.patchy_rain_nearby;
            } else {
                idImg = R.drawable.overcast;
            }
        return idImg;
    }
}