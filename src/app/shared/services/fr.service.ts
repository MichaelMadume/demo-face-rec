import { Injectable } from '@angular/core';
import { interval, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

declare var faceapi;

faceapi.env.monkeyPatch({
    Canvas: HTMLCanvasElement,
    Image: HTMLImageElement,
    ImageData,
    Video: HTMLVideoElement,
    createCanvasElement: () => document.createElement('canvas'),
    createImageElement: () => document.createElement('img'),
});

export class FaceDetectionOptions {
    expression?: boolean;
    ageAndGender?: boolean;
    faceDescriptor?: boolean;
    faceLandmarks?: boolean;
}

export class FaceExpressions {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
}

@Injectable({
    providedIn: 'root'
})
export class FrService {

    detections: any;
    isNeuralNetworkLoaded = false;
    isFrInitialized = false;

    isFrInitializedSubject = new BehaviorSubject<boolean>(false);

    nosOfFaceDescriptorsPerVisitor = 6;
    maxAllowableDescriptorDistance = 0.400000000;

    constructor() { }

    async initFr() {
        const initImg = this.createImgElementFromSrc('./assets/images/face-recognition/fr-face.jpg');

        const MODEL_URL = './assets/cnn-models';
        await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
        await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
        await faceapi.loadFaceExpressionModel(MODEL_URL);
        await faceapi.loadFaceRecognitionModel(MODEL_URL);
        await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);

        this.isNeuralNetworkLoaded = true;
        console.log(await this.detectAllFaces(initImg, {
            ageAndGender: true,
            faceLandmarks: true,
            faceDescriptor: true,
            expression: true
        }));

        this.isFrInitialized = true;
        this.isFrInitializedSubject.next(true);
    }

    async detectAllFaces(
        input: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement, options?: FaceDetectionOptions,
        tinyDetectorOptions = { inputSize: 192, scoreThreshold: 0.4 }
    ) {
        if (!this.isNeuralNetworkLoaded) {
            return [];
        }
        this.detections = null;

        if (options) {
            const { expression, ageAndGender, faceDescriptor, faceLandmarks } = options;

            if ((!expression) && (!ageAndGender) && (!faceDescriptor) && (faceLandmarks)) {
                this.detections = await faceapi
                    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions(tinyDetectorOptions))
                    .withFaceLandmarks(true);
            }

            if ((expression) && (!ageAndGender) && (!faceDescriptor)) {
                this.detections = await faceapi
                    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions(tinyDetectorOptions))
                    .withFaceLandmarks(true)
                    .withFaceExpressions();
            }

            if ((!expression) && (ageAndGender) && (!faceDescriptor)) {
                this.detections = await faceapi
                    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions(tinyDetectorOptions))
                    .withFaceLandmarks(true)
                    .withAgeAndGender();
            }

            if ((!expression) && (!ageAndGender) && (faceDescriptor)) {
                this.detections = await faceapi
                    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions(tinyDetectorOptions))
                    .withFaceLandmarks(true)
                    .withFaceDescriptors();
            }

            if ((!expression) && (ageAndGender) && (faceDescriptor)) {
                this.detections = await faceapi
                    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions(tinyDetectorOptions))
                    .withFaceLandmarks(true)
                    .withAgeAndGender()
                    .withFaceDescriptors();
            }

            if ((expression) && (!ageAndGender) && (faceDescriptor)) {
                this.detections = await faceapi
                    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions(tinyDetectorOptions))
                    .withFaceLandmarks(true)
                    .withFaceExpressions()
                    .withFaceDescriptors();
            }

            if ((expression) && (ageAndGender) && (!faceDescriptor)) {
                this.detections = await faceapi
                    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions(tinyDetectorOptions))
                    .withFaceLandmarks(true)
                    .withFaceExpressions()
                    .withAgeAndGender();
            }

            if ((expression) && (ageAndGender) && (faceDescriptor)) {
                this.detections = await faceapi
                    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions(tinyDetectorOptions))
                    .withFaceLandmarks(true)
                    .withFaceExpressions()
                    .withAgeAndGender()
                    .withFaceDescriptors();
            }

        } else {
            this.detections = await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions(tinyDetectorOptions));
        }
        return this.detections;
    }

    detectAllFacesFromStream(input: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement, options?: FaceDetectionOptions) {
        return interval(200).pipe(
            map(async () => await this.detectAllFaces(input, options, { inputSize: 160, scoreThreshold: 0.4 }))
        );
    }

    async extractFaces(input: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement): Promise<string[]> {
        this.detections = await this.detectAllFaces(input, { faceLandmarks: true });
        const canvasArray = await faceapi.extractFaces(
            input, this.detections.map(res => res.detection)
        ) as HTMLCanvasElement[];
        const imageArray: string[] = [];
        canvasArray.forEach(
            canvas => imageArray.push(canvas.toDataURL())
        );
        return imageArray;
    }

    createImgElementFromSrc(src: string) {
        const image = new Image();
        image.src = src;
        return image;
    }

    recogniseFaceFromDesciptors(descriptor: Float32Array[][], descriptor2: Float32Array) {
        const labeledDescriptors = descriptor.map(
            (d, i) => new faceapi.LabeledFaceDescriptors(`${i}`, [...d])
        );
        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, this.maxAllowableDescriptorDistance);
        const bestMatch = faceMatcher.findBestMatch(descriptor2);
        return bestMatch;
    }

    serializeDescriptor(descriptor: Float32Array[]): string {
        return JSON.stringify([...descriptor.map((d) => JSON.stringify([...d]))]);
    }

    deserializeDescriptors(serializedDescriptor: string): Float32Array[] {
        if (serializedDescriptor) {
            return (JSON.parse(serializedDescriptor) as string[]).map(d => Float32Array.from(JSON.parse(d)));
        } else {
            return null;
        }
    }

    updateFaceDescriptor(singleFacecDescriptor: Float32Array[], descriptorForUpdate: Float32Array) {
        const scoreArray = new Array(singleFacecDescriptor.length);
        singleFacecDescriptor.forEach(
            (descriptor, i) => {
                scoreArray[i] = this.recogniseFaceFromDesciptors([[descriptor]], descriptorForUpdate).distance;
            }
        );

        scoreArray.forEach(
            (score, i) => {
                if (score > (this.maxAllowableDescriptorDistance + 0.1)) {
                    singleFacecDescriptor.splice(i);
                }
            }
        );

        if (singleFacecDescriptor.length < this.nosOfFaceDescriptorsPerVisitor) {
            singleFacecDescriptor.push(descriptorForUpdate);
        } else {
            const worstDescriptorDistance = Math.max(...scoreArray);
            if (worstDescriptorDistance > (this.maxAllowableDescriptorDistance - 0.1)) {
                singleFacecDescriptor[scoreArray.indexOf(worstDescriptorDistance)] = descriptorForUpdate;
            }
        }
        return singleFacecDescriptor;
    }

    getExpression(expressions: FaceExpressions): string {
        if (!expressions) {
            return 'unknown';
        }
        const expressionNames = Object.keys(expressions);
        const expressionValues = Object.values(expressions);

        const mostConfidentExpressionIndex = expressionValues.indexOf(Math.max(...expressionValues));

        return expressionNames[mostConfidentExpressionIndex];
    }

}
