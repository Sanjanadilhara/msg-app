package com.example.msgapplication.cusViews;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class Spinner extends View {

    private Paint spinnerPaint;
    private float startAng=0;
    private double endAng=10;

    ValueAnimator animator=ValueAnimator.ofInt(0, 360);

    public Spinner(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        spinnerPaint=new Paint();
        spinnerPaint.setColor(Color.argb(255, 180, 180, 180));
        spinnerPaint.setStyle(Paint.Style.STROKE);
        spinnerPaint.setStrokeWidth(10);
        animator.setDuration(2000);
        animator.setRepeatCount(ValueAnimator.INFINITE);
        animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(@NonNull ValueAnimator animation) {
                startAng+=3.0;
                endAng+=2.0;
                endAng=endAng%360;


                invalidate();
            }
        });


    }

    @Override
    protected void onDraw(@NonNull Canvas canvas) {
        canvas.drawArc(50, 50, getWidth()-50, getHeight()-50, startAng, (float) endAng, false, spinnerPaint);
//        canvas.drawColor(Color.argb(255, 255, 255, startAnng));
    }
    public void startAnimation(){
        animator.start();
    }
    public void stopAnimatio(){
        animator.cancel();
    }
}
