# Image Reader

Sample Ionic+Angular App that uses 'cap-ml' plugin to detect text in images

## Install Prerequisites

This is an Ionic Project, so install ionic globally like this -
`npm install -g @ionic/cli`

## Running the App

- Checkout the repository at https://github.com/bendyworks/cap-ml
- Navigate to examples/text-detection/ImageReader
- Install dependencies - `npm install`
- Build the project - `npm run build` or `ionic build`
- Since this is really an ios Plugin, open the app in XCode using `npx cap open ios`
- Once XCode opens up, run the app either on a simulator or device.
- Once the app opens up, click on 'Pick a Picture' and select a picture with some text.
- App will immediately process the image and present text detections on the image chosen.
- Click on the highlighted regions to get the text in that location.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/bendyworks/cap-ml.
