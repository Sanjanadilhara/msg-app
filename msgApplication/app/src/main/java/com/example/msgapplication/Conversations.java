package com.example.msgapplication;

import android.content.Context;

import java.util.ArrayList;

public class Conversations {
    public ArrayList<Conversation> conversations;
    private  String conFile="conversations";
    Conversations(Context context){
        System.out.println("initilizing conversatiosns");
        conversations=new ArrayList<>();
        FileHandler.readFile(context, conFile, new FileHandler.Content() {
            @Override
            public void read(String line) {
                System.out.println("this is a line:"+line);
                String[] conData=line.split(",");
                conversations.add(new Conversation(context, conData[0], conData[1], conData[2]));
            }
        });
    }
}
