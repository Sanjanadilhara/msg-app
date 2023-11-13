package com.example.msgapplication;

import android.content.Context;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class FileHandler {
    public static interface Content{
        public void read(String line);
    }
    public static void readFile(Context context, String filename, Content fileContentHandler){
        try {

            FileInputStream fis = context.openFileInput(filename);
            InputStreamReader inputStreamReader = new InputStreamReader(fis, StandardCharsets.UTF_8);
            StringBuilder stringBuilder = new StringBuilder();
            BufferedReader reader = new BufferedReader(inputStreamReader);
            String line = reader.readLine();
            while (line != null) {
                fileContentHandler.read(line);
                line = reader.readLine();
            }
            fis.close();
        }
        catch (Exception e) {
        }
    }
    public static  boolean write(Context context, String fileName, String toWrite, boolean append){
        File outFile = new File(context.getFilesDir(), fileName);

        try{
            outFile.createNewFile();
            FileOutputStream fileOutStream=new FileOutputStream(outFile, append);
            fileOutStream.write(toWrite.getBytes());
            fileOutStream.flush();
            fileOutStream.close();
        } catch (Exception e) {
            return false;
        }

        return true;
    }
}