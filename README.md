# Capacitor Plugin to detect text in images

## iOS Setup and Instructions
```
# Install Plugin
npm install cap-ml

# Sync the ios project
npx cap sync ios
```

## Android Setup
(Not Supported)

## Usage

```
import { Plugins } from '@capacitor/core';
const { Camera, CapML } = Plugins;
```

and where you wish to use the plugin -
```
 # prompt the user to select a picture
 imageFile = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    source: CameraSource.Photos,
  })

  # pass in the picture to 'text-detector'
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

```

A complete example can be found here - '#TODO: to be filled in'
