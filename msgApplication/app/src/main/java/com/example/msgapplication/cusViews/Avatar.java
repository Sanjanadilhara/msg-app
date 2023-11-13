package com.example.msgapplication.cusViews;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Rect;
import android.graphics.Region;
import android.util.AttributeSet;
import android.widget.ImageView;

import androidx.annotation.Nullable;

public class Avatar extends androidx.appcompat.widget.AppCompatImageView {
    public Avatar(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Path cir=new Path();
        cir.addCircle(getWidth()/2, getHeight()/2, getWidth()/2, Path.Direction.CW);
        canvas.clipPath(cir);
        super.onDraw(canvas);
    }
}
