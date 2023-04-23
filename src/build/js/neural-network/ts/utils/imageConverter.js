import { Rect } from "./rect.js";
export class ImageConverter {
    constructor() { }
    convert(canvas) {
        const [croppedCanvas, rectSize] = this.croppedImage(canvas, 20);
        const normalizedCanvas = this.centerContent(croppedCanvas, rectSize, 28);
        const normalizeCtx = normalizedCanvas.getContext('2d');
        const data = normalizeCtx.getImageData(0, 0, normalizedCanvas.width, normalizedCanvas.height);
        return this.convertToGrayscale(data);
    }
    convertToGrayscale(image) {
        const dataGrayscale = [];
        const data = image.data;
        for (let i = 0; i < data.length; i += 4) {
            const normalized = (data[i] + data[i + 1] + data[i + 2]) / 3;
            dataGrayscale.push(normalized / 255);
        }
        return dataGrayscale;
    }
    centerContent(croppedCanvas, croppedRectSize, size) {
        const centeredCanvas = document.createElement('canvas');
        const centeredCtx = centeredCanvas.getContext('2d');
        centeredCanvas.width = size;
        centeredCanvas.height = size;
        centeredCtx.drawImage(croppedCanvas, centeredCanvas.width / 2 - croppedRectSize.width / 2, centeredCanvas.height / 2 - croppedRectSize.height / 2);
        return centeredCanvas;
    }
    croppedImage(canvas, size) {
        const ctx = canvas.getContext('2d');
        const rect = this.computeBoundingRect(ctx.getImageData(0, 0, canvas.width, canvas.height));
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = size;
        croppedCanvas.height = size;
        const rectWidth = rect.computeWidth();
        const rectHeight = rect.computeHeight();
        const scalingFactor = size / Math.max(rectWidth, rectHeight);
        const croppedRectSize = {
            width: rectWidth * scalingFactor,
            height: rectHeight * scalingFactor,
        };
        croppedCtx.drawImage(canvas, rect.xMin, rect.yMin, rectWidth, rectHeight, 0, 0, croppedRectSize.width, croppedRectSize.height);
        return [croppedCanvas, croppedRectSize];
    }
    computeBoundingRect(image) {
        const rect = new Rect(image);
        for (let i = 0; i < image.width * image.height; i += 1) {
            const j = i * 4;
            if (image.data[j] > 0 || image.data[j + 1] > 0 || image.data[j + 2] > 0) {
                const x = i % image.width;
                const y = Math.floor(i / image.width);
                rect.xMin = Math.min(x, rect.xMin);
                rect.xMax = Math.max(x, rect.xMax);
                rect.yMin = Math.min(y, rect.yMin);
                rect.yMax = Math.max(y, rect.yMax);
            }
        }
        return rect;
    }
}
ImageConverter.shared = new ImageConverter();
//# sourceMappingURL=imageConverter.js.map