import { Rect } from "./rect.js";
import { Size } from "../types/size.js";

export class ImageConverter {

    static shared: ImageConverter = new ImageConverter()
    private constructor() {}

    convert(canvas: HTMLCanvasElement): number[] {
        const [croppedCanvas, rectSize] = this.croppedImage(canvas, 20);

        const  normalizedCanvas = this.centerContent(croppedCanvas, rectSize, 28) as HTMLCanvasElement
        const normalizeCtx = normalizedCanvas.getContext('2d') as CanvasRenderingContext2D

        const data = normalizeCtx.getImageData(0, 0, normalizedCanvas.width, normalizedCanvas.height)
        return this.convertToGrayscale(data)
    }

    private convertToGrayscale(image: ImageData): number[] {
        const dataGrayscale: number[] = [];
        const data  = image.data;

        for (let i = 0; i < data.length; i += 4) {
            const normalized = (data[i] + data[i + 1] + data[i + 2]) / 3;
            dataGrayscale.push(normalized / 255);
        }

        return dataGrayscale;
    }

    private centerContent(croppedCanvas: HTMLCanvasElement, croppedRectSize: Size, size: number): HTMLCanvasElement {
        const centeredCanvas = document.createElement('canvas');
        const centeredCtx = centeredCanvas.getContext('2d') as CanvasRenderingContext2D

        centeredCanvas.width = size;
        centeredCanvas.height = size;

        centeredCtx.drawImage(
            croppedCanvas,
            centeredCanvas.width / 2 - croppedRectSize.width / 2,
            centeredCanvas.height / 2 - croppedRectSize.height / 2,
        );

        return centeredCanvas;
    }

     private croppedImage(canvas: HTMLCanvasElement, size: number): [HTMLCanvasElement, Size] {
         const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
         const rect: Rect = this.computeBoundingRect(ctx.getImageData(0, 0, canvas.width, canvas.height))

         const croppedCanvas: HTMLCanvasElement = document.createElement('canvas')
         const croppedCtx = croppedCanvas.getContext('2d') as CanvasRenderingContext2D

         croppedCanvas.width = size;
         croppedCanvas.height = size;

        const rectWidth = rect.computeWidth();
        const rectHeight = rect.computeHeight();
        const scalingFactor = size / Math.max(rectWidth, rectHeight);
        const croppedRectSize: Size = {
            width: rectWidth * scalingFactor,
            height: rectHeight * scalingFactor,
        };

        croppedCtx.drawImage(
            canvas,
            rect.xMin,
            rect.yMin,
            rectWidth,
            rectHeight,
            0,
            0,
            croppedRectSize.width,
            croppedRectSize.height,
        );

        return [croppedCanvas, croppedRectSize]
    }

    private computeBoundingRect(image: ImageData): Rect {
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