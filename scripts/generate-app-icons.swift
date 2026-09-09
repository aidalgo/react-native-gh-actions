import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

struct IconCatalog: Decodable {
    struct Icon: Decodable {
        let filename: String
        let size: String
        let scale: String
    }
    let images: [Icon]
}

let directory = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
    .appendingPathComponent("ios/CrossPlatformIOS/Images.xcassets/AppIcon.appiconset")
let catalog = try JSONDecoder().decode(
    IconCatalog.self,
    from: Data(contentsOf: directory.appendingPathComponent("Contents.json"))
)
let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
let mint = CGColor(colorSpace: colorSpace, components: [0.443, 0.965, 0.718, 1])!
let white = CGColor(colorSpace: colorSpace, components: [0.961, 0.973, 0.988, 1])!
let blue = CGColor(colorSpace: colorSpace, components: [0.322, 0.651, 0.949, 1])!

for icon in catalog.images {
    let points = Double(icon.size.split(separator: "x")[0])!
    let scale = Double(icon.scale.dropLast())!
    let pixels = Int(points * scale)
    let context = CGContext(
        data: nil, width: pixels, height: pixels, bitsPerComponent: 8,
        bytesPerRow: pixels * 4, space: colorSpace,
        bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
    )!
    context.scaleBy(x: CGFloat(pixels) / 1024, y: CGFloat(pixels) / 1024)
    let background = CGGradient(
        colorsSpace: colorSpace,
        colors: [
            CGColor(colorSpace: colorSpace, components: [0.027, 0.067, 0.122, 1])!,
            CGColor(colorSpace: colorSpace, components: [0.059, 0.180, 0.227, 1])!
        ] as CFArray,
        locations: [0, 1]
    )!
    context.drawLinearGradient(
        background, start: CGPoint(x: 0, y: 0), end: CGPoint(x: 1024, y: 1024),
        options: [.drawsBeforeStartLocation, .drawsAfterEndLocation]
    )

    func stroke(_ points: [CGPoint], color: CGColor, width: CGFloat) {
        context.setStrokeColor(color)
        context.setLineWidth(width)
        context.setLineCap(.round)
        context.setLineJoin(.round)
        context.beginPath()
        context.move(to: points[0])
        for point in points.dropFirst() {
            context.addLine(to: point)
        }
        context.strokePath()
    }

    stroke([
        CGPoint(x: 350, y: 740), CGPoint(x: 215, y: 605), CGPoint(x: 350, y: 470)
    ], color: mint, width: 52)
    stroke([
        CGPoint(x: 674, y: 740), CGPoint(x: 809, y: 605), CGPoint(x: 674, y: 470)
    ], color: mint, width: 52)
    stroke([
        CGPoint(x: 562, y: 775), CGPoint(x: 462, y: 435)
    ], color: white, width: 52)
    stroke([
        CGPoint(x: 300, y: 270), CGPoint(x: 724, y: 270)
    ], color: mint, width: 18)

    for (index, center) in [CGFloat(300), 512, 724].enumerated() {
        context.setFillColor(index == 1 ? blue : mint)
        context.addPath(CGPath(
            roundedRect: CGRect(x: center - 53, y: 217, width: 106, height: 106),
            cornerWidth: 24, cornerHeight: 24, transform: nil
        ))
        context.fillPath()
        context.setFillColor(white)
        context.fillEllipse(in: CGRect(x: center - 15, y: 255, width: 30, height: 30))
    }

    let image = context.makeImage()!
    let destination = CGImageDestinationCreateWithURL(
        directory.appendingPathComponent(icon.filename) as CFURL,
        UTType.png.identifier as CFString, 1, nil
    )!
    CGImageDestinationAddImage(destination, image, nil)
    guard CGImageDestinationFinalize(destination) else {
        fatalError("Could not write \(icon.filename)")
    }
    let source = CGImageSourceCreateWithURL(
        directory.appendingPathComponent(icon.filename) as CFURL, nil
    )!
    let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil)! as NSDictionary
    precondition(properties[kCGImagePropertyPixelWidth] as? Int == pixels)
    precondition(properties[kCGImagePropertyPixelHeight] as? Int == pixels)
    precondition((properties[kCGImagePropertyHasAlpha] as? Bool) != true)
    print("Verified \(icon.filename): \(pixels)x\(pixels), opaque")
}