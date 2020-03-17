# Cap-ML

Machine Learning Plugin for Capacitor. Currently offered implementations include -
  - Text Detector: Text Detection in still images.

    On the ios side, we're using Apple's Vision Framework and MLKit's Vision Framework on the Android side. Both have some limitations like not being able to detect cursive/handwriting font etc.

    TextDetector expects the image to be sent in portrait mode only, i.e. with text facing up. It will try to process even otherwise, but note that it might result in gibberish.

## Installation

```
npm install cap-ml
```

## Usage

TextDetector exposes only one method `detectText` that returns a Promise with an array of text detections -
```
detectText(filename: string): Promise<TextDetection[]>

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
  A complete example can be found in the examples folder - examples/text-detection/ImageReader

  If you're planning to use the Camera Plugin like above or use an image from the Photo Library -
  - Open the app in XCode by running `npx cap open ios` from the sample app's root directory. ie here,at examples/TextDetector/ImageReader
  - Open info.plist
  - Add the corresponding permissions to the app -
    - Privacy - Camera Usage Description: To Take Photos and Video
    - Privacy - Photo Library Additions Usage Description: Store camera photos to camera
    - Privacy - Photo Library Usage Description: To Pick Photos from Library

## Development

After checking out the repo,
  - run `npm install` to install dependencies.
  - run `npx cap sync` to sync with ios and install pods
  Plugin should be ready at this point. To test it out -
  - navigate to examples/text-detection/ImageReader

  ### ios Development
  - run `npx capacitor open ios` to open up an XCode project.
  - Run the XCode project either on a simulator or a device.
  - For each change in the javascript part of the app, run `npm run build && npx cap sync ios` to deploy the corresponding changes to ios app
    (or)
  - (recommended) Enable live reload of the app, using `ionic capacitor run ios --livereload`
  Plugin code is located at Pods/DevelopmentPods/CapML
  - `Plugin.swift` is the entry point to the Plugin.

  ### Android Development
  - run `npx capacitor open android` to open up an Android Studio project.
  - Run the project either on a simulator or a device.
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
