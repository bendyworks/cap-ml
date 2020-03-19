package com.bendyworks.capML;

import android.net.Uri;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import java.io.File;

@NativePlugin()
public class CapML extends Plugin {

  @PluginMethod()
  public void detectText(PluginCall call) {
    String filename = call.getString("filename");
    if (filename == null) {
      call.reject("filename not specified");
      return;
    }
    String orientation = call.getString("orientation");
    if (orientation != null && !orientation.equals("UP")) {
      call.reject("Received orientation:"+ orientation + ". Android plugin cannot alter image orientation. Please pass in the image upright.");
      return;
    }
    // remove file:// from the filename
    filename = filename.substring(7);
    File file = new File(filename);

    if (file.exists()) {
      Uri uri = Uri.fromFile(file);

      TextDetector td = new TextDetector();
      td.detectText(call, this.getContext(), uri, 0);
    } else {
      call.reject("File not found");
      return;
    }
  }
}
