package com.example.msgapplication;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.msgapplication.cusViews.Avatar;

import java.util.ArrayList;


public class ChatAdapter extends RecyclerView.Adapter<ChatAdapter.ChatViewHolder> {

    private Conversations dataList;
    public static class ChatViewHolder extends RecyclerView.ViewHolder {
        private final TextView name;
        private final TextView lastMsg;
        private final Avatar profile;
        private final LinearLayout card;
        private int dataListIndex;


        public ChatViewHolder(View view) {
            super(view);
            // Define click listener for the ViewHolder's View
            name=(TextView) view.findViewById(R.id.conName);
            lastMsg=(TextView) view.findViewById(R.id.lastMsg);
            profile=(Avatar) view.findViewById(R.id.consAvatar);
            card=(LinearLayout) view.findViewById(R.id.consCard);

        }

        public TextView getName(){return name;}
        public TextView getLastMsg(){return lastMsg;}
        public Avatar getProfile(){return profile;}

    }

    public ChatAdapter(Conversations data) {
        dataList=data;
    }

    @Override
    public ChatViewHolder onCreateViewHolder(ViewGroup viewGroup, int viewType) {


        View view = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.chat_card, viewGroup, false);

        return new ChatViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ChatViewHolder viewHolder, final int position) {
        viewHolder.getName().setText(dataList.conversations.get(position).getName());
        viewHolder.getLastMsg().setText(dataList.conversations.get(position).getLastMessage());

    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return dataList.conversations.size();
    }
}
