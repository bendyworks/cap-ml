package com.bendyworks.capML

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Rect
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
import java.nio.ByteBuffer
import android.R.attr.bitmap
import android.graphics.BitmapFactory

import android.opengl.ETC1.getHeight

import android.opengl.ETC1.getWidth




class TextDetector {
  fun detectText(call: PluginCall, context: Context, fileUri: Uri, degrees: Int) {
    val image: FirebaseVisionImage
    val detectedText = ArrayList<Any>()

    val imageRotation = degreesToFirebaseRotation(degrees)
//    val bitmap: Bitmap = MediaStore.Images.Media.getBitmap(context.contentResolver, fileUri)
//    val bitmap = BitmapFactory.decodeFile(fileUri.toString());
//
//    println("bitmap:")
//    println(bitmap.byteCount)


//    println("scale" + scaleX + ":" + scaleY)
//
//    val size: Int = bitmap.getRowBytes() * bitmap.getHeight()
//    println("size with rowbytes:"+ bitmap.getRowBytes() + ":" + bitmap.getHeight())
//    println("size with getWidth:" + bitmap.getWidth() + ":" + bitmap.getHeight())
//    val byteBuffer: ByteBuffer = ByteBuffer.allocate(size)
//    bitmap.copyPixelsToBuffer(byteBuffer)
//    val byteArray = byteBuffer.array()

    val tempImage = FirebaseVisionImage.fromFilePath(context, fileUri)
    val bitmap = tempImage.bitmap
    bitmap.
    val byteArray = bitmap.convertToByteArray()

    val scaleX = 480// 480x360 is typically sufficient for
    val scaleY = 360// image recognition

    val metadata = FirebaseVisionImageMetadata.Builder()
      .setWidth(480)
      .setHeight(360)
      .setFormat(FirebaseVisionImageMetadata.IMAGE_FORMAT_NV21)  // YCrCb format used for images, which uses the NV21 encoding format.
      .setRotation(FirebaseVisionImageMetadata.ROTATION_0)
      .build()

    println("size:" + bitmap.getRowBytes() + ":" + bitmap.getHeight())
    println("byteArray:" + byteArray)
    println("byteArray:" + byteArray.size)
//{topLeft=[0.24166666666666667, 0.79], topRight=[0.25833333333333336, 0.79], bottomLeft=[0.24166666666666667, 0.7883333333333333], bottomRight=[0.25833333333333336, 0.7883333333333333], text=--}
    try {
//      image = FirebaseVisionImage.fromBitmap(bitmap);
       image = FirebaseVisionImage.fromByteArray(byteArray, metadata)
//      val image = FirebaseVisionImage.fromFilePath(context, fileUri)
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
}

@Throws(IOException::class)
fun Bitmap.convertToByteArray(): ByteArray {
  //minimum number of bytes that can be used to store this bitmap's pixels
  val size = this.byteCount

  //allocate new instances which will hold bitmap
  val buffer = ByteBuffer.allocate(size)
  val bytes = ByteArray(size)

  //copy the bitmap's pixels into the specified buffer
  this.copyPixelsToBuffer(buffer)

  //rewinds buffer (buffer position is set to zero and the mark is discarded)
  buffer.rewind()

  //transfer bytes from buffer into the given destination array
  buffer.get(bytes)

  //return bitmap's pixels
  return bytes
}
