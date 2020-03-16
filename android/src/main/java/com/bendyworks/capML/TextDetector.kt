package com.bendyworks.capML

import com.getcapacitor.PluginCall
import com.getcapacitor.JSObject

import android.content.Context
import android.net.Uri
import com.google.firebase.ml.vision.FirebaseVision
import com.google.firebase.ml.vision.common.FirebaseVisionImage
import com.google.firebase.ml.vision.text.FirebaseVisionTextRecognizer
import org.json.JSONArray
import java.io.IOException
import kotlin.collections.ArrayList


class TextDetector {
  fun detectText(call: PluginCall, context: Context, fileUri: Uri, degrees: Int) {
    val image: FirebaseVisionImage
    val detectedText = ArrayList<Any>()

    try {
      image = FirebaseVisionImage.fromFilePath(context, fileUri);
      val bitmap = image.getBitmap()
      val width = bitmap.getWidth()
      val height = bitmap.getHeight()

      if (image == null) {
        call.reject("file does not contain an image")
      } else {
        val textDetector: FirebaseVisionTextRecognizer = FirebaseVision.getInstance().getOnDeviceTextRecognizer();

        textDetector.processImage(image)
          .addOnSuccessListener { detectedBlocks ->
            println("success")
            for (block in detectedBlocks.textBlocks) {
              for (line in block.lines) {
                val rect = line.boundingBox
                if (rect !=null && rect.left != null && rect.right != null && rect.top != null && rect.bottom != null) {
                  val textDetection = mapOf(
                    "topLeft" to listOf<Double?>((rect.left).toDouble()/width, (height - rect.top).toDouble()/height),
                    "topRight" to listOf<Double?>((rect.right).toDouble()/width, (height - rect.top).toDouble()/height),
                    "bottomLeft" to listOf<Double?>((rect.left).toDouble()/width, (height - rect.bottom).toDouble()/height),
                    "bottomRight" to listOf<Double?>((rect.right).toDouble()/width, (height - rect.bottom).toDouble()/height),
                    "text" to line.text
                    )
                    detectedText.add(textDetection)
                  } else {
                    call.reject("FirebaseVisionTextRecognizer.processImage: could not get bounding coordinates")
                  }
                }
            }

            val ret = JSObject()
            ret.put("textDetections", JSONArray(detectedText))
            call.success(ret)
          }
          .addOnFailureListener { e ->
            call.reject("FirebaseVisionTextRecognizer couldn't process the given image", e)
          }
      }
    } catch (e: IOException) {
      e.printStackTrace();
    }
  }
}
