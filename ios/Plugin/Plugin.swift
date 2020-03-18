import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(CapML)
public class CapML: CAPPlugin {
    @objc func detectText(_ call: CAPPluginCall) {
        guard var filename = call.getString("filename") else {
            call.reject("file not found")
            return
        }

        // removeFirst(7) removes the initial "file://"
        filename.removeFirst(7)
        guard let image = UIImage(contentsOfFile: filename) else {
            call.reject("file does not contain an image")
            return
        }
        
        TextDetector(call: call, image: image).detectText()
    }
}
