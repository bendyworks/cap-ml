# Cap-ML

Machine Learning Plugin for Capacitor. Here are the features currently offered -
  - Text Detection in still images:
    We're using Apple's Vision Framework. There are some limitations like not being able to detect cursive/handwriting font etc.
    (It is also assumed that the picture is sent in portrait mode. ) # TODO: ?


## Installation

```
npm install cap-ml
```

## Usage

In an Angular project, it can be imported like:
TODO: Should I write up something for a react app too ?

```
import { Plugins } from '@capacitor/core';
const { Camera, CapML } = Plugins;
```

and used like:
```
 # prompt the user to select a picture
 imageFile = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    source: CameraSource.Photos,
  })

  # pass in the picture to 'CapML' plugin
  var response = await CapML.detectText({filename: imageFile.path!})
  textDetections = response.detectedText;

  # textDetections is an array of detected texts and corresponding bounding box coordinates
  # which can be accessed like -
  textDetections.forEach((detection: TextDetection) => {
    text = detection.text
    bottomLeft = detection.bottomLeft
    bottomRight = detection.bottomRight
    topLeft = detection.topLeft
    topRight = detection.topRight
  })

  A complete example can be found in the examples folder - examples/text-detection/ImageReader
  (Sample project is an Ionic-Angular App)
  TODO: should I do a sample react app too ?
```

## Development

After checking out the repo, run `npm install` to install dependencies.
To test it out,
  - navigate to examples/text-detection/ImageReader
  - run `npm install`
  - run `npx capacitor open ios`. This opens an XCode project.
  - Run the XCode project either on a simulator or a device.
TODO: these instructions look very straight forward. Repeat the process to make sure all steps are covered and what problems might occur ??

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/bendyworks/cap-ml.
