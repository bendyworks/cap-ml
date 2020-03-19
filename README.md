# Cap-ML

Machine Learning Plugin for Capacitor. Currently offered implementations include -
  - Text Detector: Text Detection in still images.

    On the ios side, we're using Apple's Vision Framework and MLKit's Vision Framework on the Android side. Both have some limitations like not being able to detect cursive/handwriting font etc.

    TextDetector expects the image to be sent in portrait mode only, i.e. with text facing up. It will try to process even otherwise, but note that it might result in gibberish.

## Compatibility Chart

| Feature  | ios | android |
| ------------- | ------------- | ------------ |
| ML Framework  | Vision  | Firebase MLKIt |
| Text Detection with Still Images | Yes | Yes |
| Detects lines of text | Yes | Yes |
| Bounding Coordinates for Text | Yes | Yes |
| Image Orientation | Yes (Up, Left, Right, Down) | **No** (Upright only) |


## Installation

```
npm install cap-ml
```

## Usage

TextDetector exposes only one method `detectText` that returns a Promise with an array of text detections -
```
// ios plugin handles orientations(top, right, bottom, left) but android plugin expects the image in upright position only.
// Orientation here is not the current orientation of the image, but the direction in which the image should be turned to make it upright
detectText(filename: string, orientation?: ImageOrientation): Promise<TextDetection[]>

```
TextDetection looks like  -
```
interface TextDetection {
  bottomLeft: [number, number]; // [x-coordinate, y-coordinate]
  bottomRight: [number, number]; // [x-coordinate, y-coordinate]
  topLeft: [number, number]; // [x-coordinate, y-coordinate]
  topRight: [number, number]; // [x-coordinate, y-coordinate]
  text: string;
}
```

ImageOrientation is an enum  -
```
enum ImageOrientation {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```
bottomLeft[x,y], bottomRight[x,y], topLeft[x,y], topRight[x,y] provide the coordinates for the bounding quadrangle for the detected 'text'. Often, this would be a rectangle, but the text might be skewed.


## Example Usage

```
import { Plugins } from '@capacitor/core';
const { Camera } = Plugins;
import { TextDetector, TextDetection } from 'cap-ml';
```

and used like:

```
 # prompt the user to select a picture
  const imageFile = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    source: CameraSource.Photos,
  })

  # pass in the picture to 'CapML' plugin
  const td = new TextDetector();
  const textDetections = await td.detectText(imageFile.path!)

  # or with orientation -
  # const textDetections = await td.detectText(imageFile.path!, ImageOrientation.Up)

  # textDetections is an array of detected texts and corresponding bounding box coordinates
  # which can be accessed like -
  textDetections.forEach((detection: TextDetection) => {
    text = detection.text
    bottomLeft = detection.bottomLeft
    bottomRight = detection.bottomRight
    topLeft = detection.topLeft
    topRight = detection.topRight
  })
```

If you're using it in an Android app (generated through Ionic), there is an additional step. Make sure to register the plugin in the app's MainActivity.java
    - Import the Plugin: `import com.bendyworks.capML.CapML`
    - Register the Plugin: On the same file, inside OnCreate's init, add  - `add(CapML.class)`

  A complete example can be found in the examples folder - examples/text-detection/ImageReader

  If you're planning to use the Camera Plugin like in the example project or use an image from the Photo Library -

  For ios:
  - Open the app in XCode by running `npx cap open ios` from the sample app's root directory. ie here, at examples/text-detection/ImageReader
  - Open info.plist
  - Add the corresponding permissions to the app -
    - Privacy - Camera Usage Description: To Take Photos and Video
    - Privacy - Photo Library Additions Usage Description: Store camera photos to camera
    - Privacy - Photo Library Usage Description: To Pick Photos from Library

  For Android:
  - Open the app in Android Studio by running `npx cap open android` from the sample app's root directory. ie here, at examples/text-detection/ImageReader
  - Open app/manifests/AndroidManifest.xml
  - Add the corresponding permissions to the app -
    - android.permission.INTERNET
    - android.permission.READ_EXTERNAL_STORAGE
    - android.permission.WRITE_EXTERNAL_STORAGE
    - android.permission.CAMERA

  -  Note: Sample App is set up to download Firebase's OCR model for Text Detection upon installing the app. If the app errors out with something like -  `Considering local module com.google.android.gms.vision.ocr:0 and remote module com.google.android.gms.vision.ocr:0.
  E/Vision: Error loading module com.google.android.gms.vision.ocr optional module true: com.google.android.gms.dynamite.DynamiteModule$LoadingException: No acceptable module found. Local version is 0 and remote version is 0.`.

      This is a known bug with Google Play Services.

      Follow these steps -
      1. Uninstall app from the device/emulator.
      2. Update 'Google Play Services' - make sure you have the latest version.
      3. Clear cache and store for 'Google Play Services'
      4. Restart the device/emulator
      4. Install and run the app.

## Development

After checking out the repo,
  - run `npm install` to install dependencies.
  Plugin should be ready at this point. To test it out -
  - navigate to examples/text-detection/ImageReader
  - run `npm install` to install dependencies
  - run `npm run build && npx cap sync` to sync the project with ios and android

  ### ios Development
  - run `npx capacitor open ios` to open up an XCode project.
  - Run the XCode project either on a simulator or a device.
  - For each change in the javascript part of the app, run `npm run build && npx cap sync ios` to deploy the corresponding changes to ios app
    (or)
  - (recommended) Enable live reload of the app, using `ionic capacitor run ios --livereload`
  Plugin code is located at Pods/DevelopmentPods/CapML
  - `Plugin.swift` is the entry point to the Plugin.

  ### Android Development
  #### Step 1: Open Android Project

  - run `npx capacitor open android` to open up an Android Studio project.

  #### Step 2: Create Firebase Project and App

  - Naviagte to https://console.firebase.google.com/ and sign-in

  - Click on 'Add Project' and follow through the steps (Enable Google Analytics if you like but the project doesn't particularly need it)

  - Once the project is created, click on 'android' icon to create an android app.

  - Register App:
    - Enter the package name - this should be the same as the package name of your app.
      For example - package name in the example project here is `com.bendyworks.CapML.ImageReader`. Enter that if you wish to run the sample project. If you're setting up a new project, enter the package name of that app. (Tip: You can find it in app/AndroidManifest.xml). Click 'Register App'
    - Download google-services.json
    - Place the downloaded google-services.json in your project's app directory.

  - Add Firebase SDK:
    Example project should already this is place, but if you're setting up a new project, follow the instructions to modify build.gradle to use the downloaded google-services.json

  - Once the build changes are in place, perform a Gradle sync at this point. (Android Studio will prompt for a gradle sync as soon as a change is made to build files)

  #### Step 3: Making changes and running the app
  - The example project is already setup to use the plugin, but if you're setting up a new project -
      In the project's MainActivity.java -
        - Import the Plugin: `import com.bendyworks.capML.CapML`
        - Register the Plugin: On the same file, inside OnCreate's init, add  - `add(CapML.class)`

  - Build and Run the project either on a simulator or a device.

  - For each change in the javascript part of the app, run `npm run build && npx cap sync android` to deploy the corresponding changes to android app

    (or)
  - (recommended) Enable live reload of the app, using `ionic capacitor run android --livereload`

  - Plugin code is located at `android-cap-ml/java/com.bendyworks.capML`

  - `CapML.java` is the entry point to the Plugin.
    (Note: When plugin code is updated, make sure to rebuild the project before running it.)

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/bendyworks/cap-ml.

## License
Hippocratic License Version 2.0.

For more information, refer to LICENSE file
