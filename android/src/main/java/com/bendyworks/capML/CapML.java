package com.bendyworks.capML;

import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.net.Uri;
import android.provider.MediaStore;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.google.firebase.ml.vision.common.FirebaseVisionImageMetadata;

import java.io.File;
import java.io.IOException;

@NativePlugin()
public class CapML extends Plugin {

  @PluginMethod()
  public void detectText(PluginCall call) throws IOException {
    String filename = call.getString("filename");
    if (filename == null) {
      call.reject("filename not specified");
      return;
    }
    String orientation = call.getString("orientation");
    if (orientation == null) {
      orientation = "UP";
    }

    int rotation = this.orientationToRotation(orientation);

    Bitmap bitmap  = MediaStore.Images.Media.getBitmap(this.getContext().getContentResolver(), Uri.parse(filename));
    if (bitmap == null) {
      call.reject("Could not load image from path");
      return;
    } else {
      int width = bitmap.getWidth();
      int height = bitmap.getHeight();

      Matrix matrix = new Matrix();
      matrix.setRotate((float)rotation);
      Bitmap rotatedBitmap = Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);

      TextDetector td = new TextDetector();
      td.detectText(call, rotatedBitmap);
    }
  }

  private int orientationToRotation(String orientation) {
    switch (orientation) {
      case "UP":
        return 0;
      case "RIGHT":
        return 90;
      case "DOWN":
        return 180;
      case "LEFT":
        return 270;
      default:
        return 0;
    }
  }
}
