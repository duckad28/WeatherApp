package com.mobileweatherapp;

import android.annotation.SuppressLint;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import android.widget.TextView;
import android.widget.Toast;
import android.app.PendingIntent;
import android.content.Intent;

import com.mobileweatherapp.api.ApiService;
import com.mobileweatherapp.model.Currency;

import org.w3c.dom.Text;

import java.text.DateFormat;
import java.util.Date;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Implementation of App Widget functionality.
 */
public class WeatherWidget extends AppWidgetProvider {

    private static String tvTempC;
    private static String tvHumidity;

    @SuppressLint("StringFormatInvalid")
    static void updateAppWidget(Context context,
                                AppWidgetManager appWidgetManager,
                                int appWidgetId, String tvTempC, String tvHumidity) {

            String timeString =
                    DateFormat.getTimeInstance(DateFormat.SHORT).format(new Date());
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.weather_widget);
//Thay doi textview dia diem//
            //views.setTextViewText(R.id.place,);
//Thay doi textview thoi gian//
            views.setTextViewText(R.id.time_update,
                    context.getResources().getString(
                            R.string.time, timeString));
        //Toast.makeText(context, timeString, Toast.LENGTH_SHORT).show();
//Thay doi textview nhiet do//
            views.setTextViewText(R.id.temperature,
                    context.getResources().getString(
                    R.string.text_temperature, tvTempC) + " °C");
//Thay doi textview do am//
            views.setTextViewText(R.id.humidity,
                    context.getResources().getString(
                    R.string.text_humidity, tvHumidity)+"%");
            Intent intentUpdate = new Intent(context, WeatherWidget.class);
            intentUpdate.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            int[] idArray = new int[]{appWidgetId};
            intentUpdate.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, idArray);
            PendingIntent pendingUpdate = PendingIntent.getBroadcast(
                    context, appWidgetId, intentUpdate,
                    PendingIntent.FLAG_UPDATE_CURRENT);
            views.setOnClickPendingIntent(R.id.time_update, pendingUpdate);
            appWidgetManager.updateAppWidget(appWidgetId, views);
    }
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            callApi(context);
            if(tvTempC == null){
                for (int i = 0; i < 2; i++){}
            } else {
                updateAppWidget(context, appWidgetManager, appWidgetId, tvTempC, tvHumidity);
                Toast.makeText(context, "Widget has been updated! ", Toast.LENGTH_SHORT).show();
            }
        }
    }

    //https://api.weatherapi.com/v1/current.json?key=9a9dcb14233e4d9aad5142530242004&q=%22Ha%20Noi%22
    static void callApi(Context context) {
        ApiService.apiService.getDataAPI("9a9dcb14233e4d9aad5142530242004", "Ha Noi").enqueue(new Callback<Currency>() {
            @Override
            public void onResponse(Call<Currency> call, Response<Currency> response) {
                //Toast.makeText(context, "Call API success! ", Toast.LENGTH_SHORT).show();

                Currency currency = response.body();
                if(currency != null) {
                    tvTempC =  String.valueOf(currency.getCurrent().getTemp_c());
                    tvHumidity = String.valueOf(currency.getCurrent().getHumidity());
                }
                //Toast.makeText(context, tvTempC, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailure(Call<Currency> call, Throwable throwable) {
                //Toast.makeText(context, "Call API error! ", Toast.LENGTH_SHORT).show();
            }
        });
    }
}