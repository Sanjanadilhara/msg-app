package com.example.msgapplication;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.example.msgapplication.cusViews.Spinner;

import org.json.JSONException;
import org.json.JSONObject;

public class Login extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);


        getOnBackPressedDispatcher().addCallback(new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {

            }
        });


        Spinner spn=findViewById(R.id.spinner1);
        spn.setVisibility(View.INVISIBLE);
        EditText password=findViewById(R.id.editTextTextPassword);
        EditText userName=findViewById(R.id.editTextText);
        Button loginButton=findViewById(R.id.button);
        Intent main=new Intent(this, MainActivity.class);

        Connection conn=new Connection(this);
        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                spn.setVisibility(View.VISIBLE);
                spn.startAnimation();
                JSONObject userData=new JSONObject();
                try {
                    userData.put("email", userName.getText());
                    userData.put("password", password.getText());
                } catch (Exception e) {
                }
                conn.post("http://3.110.196.100/login", userData, new Connection.ExecuteNetResult() {
                    @Override
                    public void run(JSONObject data) {
                        try {
                            if(data.getInt("status")==1){
                                startActivity(main);
                            }
                            else{
                                System.out.println("wrong credintials");
                            }
                        }
                        catch (Exception e){
                            System.out.println(data.toString());
                        }
                        spn.setVisibility(View.INVISIBLE);
                        spn.stopAnimatio();
                    }
                });
            }
        });



    }
}