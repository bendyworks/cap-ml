//
//  TextDetector.swift
//  Capacitor
//
//  Created by Vennela Kodali on 3/3/20.
//

import Foundation
import Vision
import Capacitor

@available(iOS 11.3, *)
public class TextDetector {
    var detectedText: [String] = []
    let call: CAPPluginCall
    let image: UIImage

    public init(call: CAPPluginCall, image: UIImage) {
        self.call = call
        self.image = image
    }

    public func detectText() {
        // TODO: fail out if call is already used up
        guard let cgImage = image.cgImage else {
            print("Looks like uiImage is nil")
            return
        }

        let imageRequestHandler = VNImageRequestHandler(cgImage: cgImage, orientation: CGImagePropertyOrientation.up, options: [:])

        DispatchQueue.global(qos: .userInitiated).async {
            do {
                try imageRequestHandler.perform([self.textDetectionRequest])
                self.call.success(["detectedText": self.detectedText])
            } catch let error as NSError {
                print("Failed to perform image request: \(error)")
                self.call.reject(error.description)
            }
        }
    }

    lazy var textDetectionRequest: VNRecognizeTextRequest = {
        let textDetectRequest = VNRecognizeTextRequest(completionHandler: handleDetectedText)
        return textDetectRequest
    }()

    func handleDetectedText(request: VNRequest?, error: Error?) {
        if error != nil {
            call.reject("Text Detection Error \(String(describing: error))")
            return
        }
        DispatchQueue.main.async {
            guard let results = request?.results as? [VNRecognizedTextObservation] else {
                self.call.reject("error")
                return
            }
            for result in results {
                // get boundaries of text location
                let blx = Double(result.bottomLeft.x).truncate(places: 2)
                let bly = Double(result.bottomLeft.y).truncate(places: 2)
                let brx = Double(result.bottomRight.x).truncate(places: 2)
                let bry = Double(result.bottomRight.y).truncate(places: 2)
                let tlx = Double(result.topLeft.x).truncate(places: 2)
                let tly = Double(result.topLeft.y).truncate(places: 2)
                let trx = Double(result.topRight.x).truncate(places: 2)
                let trY = Double(result.topRight.y).truncate(places: 2)

                let bottomLeft = Coordinates(blx, bly)
                let bottomRight = Coordinates(brx, bry)
                let topLeft = Coordinates(tlx, tly)
                let topRight = Coordinates(trx, trY)

                // detected text
                let text = result.topCandidates(1).first?.string ?? ""

                let result = DetectedText(bottomLeft: bottomLeft, bottomRight: bottomRight, topLeft: topLeft, topRight: topRight, text: text)

                do {
                    let jsonData = try JSONEncoder().encode(result)
                    let payload = String(data: jsonData, encoding: .utf8)!
                    self.detectedText.append(payload)
                } catch let error as NSError {
                    print(error.description)
                    self.call.reject(error.description)
                }
            }
        }
    }
}

extension Double
{
    func truncate(places : Int)-> Double
    {
        return Double(floor(pow(10.0, Double(places)) * self)/pow(10.0, Double(places)))
    }
}

public struct DetectedText: Codable {
    var bottomLeft: (Coordinates) = Coordinates(0,0)
    var bottomRight: (Coordinates) = Coordinates(0,0)
    var topLeft: (Coordinates) = Coordinates(0,0)
    var topRight: (Coordinates) = Coordinates(0,0)
    var text: String = ""

    public init(bottomLeft: (Coordinates), bottomRight: (Coordinates), topLeft: (Coordinates), topRight: (Coordinates), text: String) {
        // Bounding rectangle coordinates for the text
        self.bottomLeft = bottomLeft
        self.bottomRight = bottomRight
        self.topLeft = topLeft
        self.topRight = topRight

        // Detected text
        self.text = text
    }
}

public struct Coordinates: Codable {
    var x: Double
    var y: Double

    public init(_ x: Double, _ y: Double) {
        self.x = x;
        self.y = y;
    }
}
