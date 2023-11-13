package com.example.msgapplication;




import android.content.Context;

import java.util.ArrayList;

public class Conversation {

    public class Message{
        public String Message;
        public boolean isSent;
        Message(String message, boolean issent){
            Message =message;
            isSent=issent;
        }

    }
    private String conversationId;
    private String name;
    private String profile;
    private String fileName;
    public ArrayList<Message> lastMessages;
    private int numOfNonStoredMessages=0;
    Context context;
    Conversation(Context ctx, String username, String conId, String filename){
        context=ctx;
        conversationId=conId;
        name=username;
        fileName=filename;
        lastMessages= new ArrayList<>();
        FileHandler.readFile(context, fileName, new FileHandler.Content() {
            @Override
            public void read(String line) {
                String[] data=line.split(",");
                boolean isSent=false;
                if(data[1]=="1"){
                    isSent=true;
                }
                lastMessages.add(new Message(data[0], isSent));
            }
        });
    }

    String getName(){
        return name;
    }
    String getLastMessage(){return "last Message "+fileName;}
}
