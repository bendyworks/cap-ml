package com.bendyworks.capML

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Rect
import android.media.Image
import android.net.Uri
import android.provider.MediaStore
import android.util.NoSuchPropertyException
import com.getcapacitor.JSObject
import com.getcapacitor.PluginCall
import com.google.firebase.ml.vision.FirebaseVision
import com.google.firebase.ml.vision.common.FirebaseVisionImage
import com.google.firebase.ml.vision.common.FirebaseVisionImageMetadata
import com.google.firebase.ml.vision.text.FirebaseVisionTextRecognizer
import org.json.JSONArray
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.io.InputStream

class TextDetector {
  fun detectText(call: PluginCall, context: Context, fileUri: Uri, degrees: Int) {
    val image: FirebaseVisionImage
    val detectedText = ArrayList<Any>()

    val imageRotation = degreesToFirebaseRotation(degrees)
    val bitmap: Bitmap = MediaStore.Images.Media.getBitmap(context.contentResolver, fileUri)
    println("bitmap:")
    println(bitmap.byteCount)
    val scaleX = 300// 480x360 is typically sufficient for
    val scaleY = 300 // image recognition

    println("scale" + scaleX + ":" + scaleY)

    val stream = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.JPEG, 100, stream)
    val byteArray: ByteArray = stream.toByteArray()

    val metadata = FirebaseVisionImageMetadata.Builder()
      .setWidth(scaleX)
      .setHeight(scaleY)
      .setFormat(FirebaseVisionImageMetadata.IMAGE_FORMAT_NV21)  // YCrCb format used for images, which uses the NV21 encoding format.
      .setRotation(imageRotation)
      .build()

    try {
      image = FirebaseVisionImage.fromBitmap(bitmap);
//      image = FirebaseVisionImage.fromByteArray(byteArray, metadata)
      val textDetector: FirebaseVisionTextRecognizer = FirebaseVision.getInstance().getOnDeviceTextRecognizer();

      textDetector.processImage(image)
        .addOnSuccessListener { detectedBlocks ->
          for (block in detectedBlocks.textBlocks) {
            for (line in block.lines) {
              val rect: Rect = line.boundingBox ?: throw NoSuchPropertyException("FirebaseVisionTextRecognizer.processImage: could not get bounding coordinates")

              val textDetection = mapOf(
                // normalizing coordinates
                "topLeft" to listOf<Double?>((rect.left).toDouble()/scaleX, (scaleY - rect.top).toDouble()/scaleY),
                "topRight" to listOf<Double?>((rect.right).toDouble()/scaleX, (scaleY - rect.top).toDouble()/scaleY),
                "bottomLeft" to listOf<Double?>((rect.left).toDouble()/scaleX, (scaleY - rect.bottom).toDouble()/scaleY),
                "bottomRight" to listOf<Double?>((rect.right).toDouble()/scaleX, (scaleY - rect.bottom).toDouble()/scaleY),
                "text" to line.text
              )
              println("text detection:")
              println(textDetection)
              detectedText.add(textDetection)
            }
          }
          call.success(JSObject().put("textDetections", JSONArray(detectedText)))
        }
        .addOnFailureListener { e ->
          println("error error error")
          call.reject("FirebaseVisionTextRecognizer couldn't process the given image", e)
        }
    } catch (e: Exception) {
      e.printStackTrace();
      call.reject(e.localizedMessage, e)
    }
  }

  private fun degreesToFirebaseRotation(degrees: Int): Int = when(degrees) {
    0 -> FirebaseVisionImageMetadata.ROTATION_0
    90 -> FirebaseVisionImageMetadata.ROTATION_90
    180 -> FirebaseVisionImageMetadata.ROTATION_180
    270 -> FirebaseVisionImageMetadata.ROTATION_270
    else -> throw Exception("Rotation must be 0, 90, 180, or 270.")
  }

  @Throws(IOException::class)
  private fun getBytes(inputStream: InputStream): ByteArray {
    val byteBuffer = ByteArrayOutputStream()
    val bufferSize = 1024
    val buffer = ByteArray(bufferSize)
    var len = 0
    while (inputStream.read(buffer).also { len = it } != -1) {
      byteBuffer.write(buffer, 0, len)
    }
    return byteBuffer.toByteArray()
  }
}

