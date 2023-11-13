package com.example.msgapplication;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity {

    private RecyclerView conversationRecView;
    private ChatAdapter chatAdapter;
    private Conversations chats;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        conversationRecView=findViewById(R.id.conversations);

        SharedPreferences pref=this.getSharedPreferences("cookieStore", MODE_PRIVATE);
//        pref.edit().putString("cookies", "").apply();
        String cookies=pref.getString("cookies", "");
        System.out.println("cooookies:  "+cookies);
        if (cookies.isEmpty()) {
            System.out.println(cookies);
            Intent login=new Intent(this, Login.class);
            startActivity(login);
        }


//        FileHandler.write(this, "conversations", "Sanjana,1,chatsanjana\n", true);
//        FileHandler.write(this, "conversations", "Sanjana Dilhara,2,chatanother\n", true);
//        FileHandler.write(this, "conversations", "sandeepa,3,chatanotherone\n", true);
//        FileHandler.write(this, "conversations", "name name,4,chatsanjbb\n", true);
//        FileHandler.write(this, "conversations", "another name,5,chatsanjanvba\n", true);
//        FileHandler.write(this, "conversations", "Another One,6,chatsanjanbvba\n", true);

        chats=new Conversations(this);
        chatAdapter=new ChatAdapter(chats);
        conversationRecView.setLayoutManager(new LinearLayoutManager(this));
        conversationRecView.setAdapter(chatAdapter);




    }
}