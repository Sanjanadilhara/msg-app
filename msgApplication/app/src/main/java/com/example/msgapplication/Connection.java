package com.example.msgapplication;


import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.HandlerThread;
import android.os.Handler;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.MediaType;
import okhttp3.OkHttp;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;



public class Connection {
    public static interface ExecuteNetResult{
        public void run(JSONObject data);
    };
//    public static final MediaType JSON = MediaType.get("application/json");
    private OkHttpClient client;
    Activity mainActivity;
    private Handler handler;
    private SharedPreferences cookieStore;
    private HandlerThread networkQueue;
    Connection(Activity activity){
        mainActivity=activity;
        cookieStore=activity.getSharedPreferences("cookieStore", Context.MODE_PRIVATE);
        client=new OkHttpClient();
        networkQueue = new HandlerThread("IO");
        networkQueue.start();
        handler= new Handler(networkQueue.getLooper());

    }
    public void get(String url, ExecuteNetResult resultExecutor){
        JSONObject err=new JSONObject();

        Request request = new Request.Builder()
                .url(url)
                .header("Cookie", cookieStore.getString("cookies", ""))
                .build();
        System.out.println(request.toString());

        handler.post(new Runnable() {
            @Override
            public void run() {
                try (Response response = client.newCall(request).execute()) {
                    if(cookieStore.getString("cookies", "").isEmpty()) {
                        cookieStore.edit().putString("cookies", response.header("set-cookie")).apply();
                    }
                    else{
                        cookieStore.edit().putString("cookies", cookieStore.getString("cookies", "") +";"+ response.header("set-cookie")).apply();

                    }

                    JSONObject dataToExec=new JSONObject(response.peekBody(response.body().contentLength()).string());
                    mainActivity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            resultExecutor.run(dataToExec);
                        }
                    });

                }
                catch (Exception e){
                    System.out.println("connection errr");
                    resultExecutor.run(err);
                }
            }
        });


    }



    public void post(String url, JSONObject data, ExecuteNetResult resultExecutor){
        JSONObject err=new JSONObject();
        Request request = new Request.Builder()
                .url(url)
                .header("Cookie", cookieStore.getString("cookies", ""))
                .post(RequestBody.create(data.toString(), MediaType.get("application/json; charset=utf-8")))
                .build();

        handler.post(new Runnable() {
            @Override
            public void run() {
                try (Response response = client.newCall(request).execute()) {

                    if(cookieStore.getString("cookies", "").isEmpty()) {
                        cookieStore.edit().putString("cookies", response.header("set-cookie")).apply();
                    }
                    else{
                        cookieStore.edit().putString("cookies", cookieStore.getString("cookies", "") +";"+ response.header("set-cookie")).apply();

                    }


                    JSONObject dataToExec=new JSONObject(response.peekBody(response.body().contentLength()).string());
                    mainActivity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            resultExecutor.run(dataToExec);
                        }
                    });

                }
                catch (Exception e){
                    resultExecutor.run(err);
                }
            }
        });


    }
//    public download(path ,file)   to be added
}
