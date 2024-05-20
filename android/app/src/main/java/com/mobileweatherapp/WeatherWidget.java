package com.mobileweatherapp;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import android.widget.Toast;
import android.app.PendingIntent;
import android.content.Intent;
import android.net.Uri;
import java.text.DateFormat;
import java.util.Date;

/**
 * Implementation of App Widget functionality.
 */
public class WeatherWidget extends AppWidgetProvider {
    static void updateAppWidget(Context context,
                                AppWidgetManager appWidgetManager,
                                int appWidgetId) {
//Retrieve the current time//
        String timeString =
                DateFormat.getTimeInstance(DateFormat.SHORT).format(new Date());
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.weather_widget);
//Thay doi textview dia diem//
        //views.setTextViewText(R.id.place, String.valueOf(appWidgetId));
//Thay doi textview thoi gian//
        views.setTextViewText(R.id.time_update,
                context.getResources().getString(
                        R.string.time, timeString));
//Create an Intent with the AppWidgetManager.ACTION_APPWIDGET_UPDATE action//
        Intent intentUpdate = new Intent(context, WeatherWidget.class);
        intentUpdate.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
//Update the current widget instance only, by creating an array that contains the widget’s unique ID//
        int[] idArray = new int[]{appWidgetId};
        intentUpdate.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, idArray);
//Wrap the intent as a PendingIntent, using PendingIntent.getBroadcast()//
        PendingIntent pendingUpdate = PendingIntent.getBroadcast(
                context, appWidgetId, intentUpdate,
                PendingIntent.FLAG_UPDATE_CURRENT);
//Send the pending intent in response to the user tapping the ‘Update’ TextView//
        views.setOnClickPendingIntent(R.id.imageButton, pendingUpdate);
        //Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://code.tutsplus.com/"));//
        //PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);//
        //views.setOnClickPendingIntent(R.id.place, pendingIntent);//
//Request that the AppWidgetManager updates the application widget//
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
            Toast.makeText(context, "Widget has been updated! ", Toast.LENGTH_SHORT).show();
        }
    }
}