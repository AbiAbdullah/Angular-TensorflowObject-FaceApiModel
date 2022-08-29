import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var faceapi: any;
@Component({
  selector: 'app-face-match',
  templateUrl: './face-match.component.html',
  styleUrls: ['./face-match.component.scss'],
})
export class FaceMatchComponent implements OnInit {
  @ViewChild('video')
  public video!: ElementRef;

  @ViewChild('canvas')
  public canvas!: ElementRef;

  public captures: Array<any>;

  public constructor() {
    this.captures = [];
  }

  public ngOnInit() {}

  public ngAfterViewInit() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: 'user',
          },
        })
        .then((stream: any) => {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.loadfaceApi();
        });
    }
  }

  loadfaceApi() {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('assets/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('assets/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('assets/models'),
      faceapi.nets.ageGenderNet.loadFromUri('assets/models'),
    ])
      .then((values) => {})
      .catch((error) => {
        console.error(error);
      });
  }

  public capture() {
    var context = this.canvas.nativeElement
      .getContext('2d')
      .drawImage(this.video.nativeElement, 0, 0, 640, 480);
    this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
    this.faceMatch(this.canvas.nativeElement)
  }

  async faceMatch(imageElm: any) {
    const referenceImage = await faceapi.fetchImage('assets/images/abi.png');

    console.log(referenceImage instanceof HTMLImageElement); // true

    // displaying the fetched image content
    // const myImg:any = document.getElementById('myImg')
    //    myImg['src'] = referenceImage.src
    const results = await faceapi
      .detectAllFaces(referenceImage, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (!results.length) {
      console.log('not face found');
      
      return;
    }

    // create FaceMatcher with automatically assigned labels
    // from the detection results for the reference image
    const faceMatcher = new faceapi.FaceMatcher(results);

    const singleResult = await faceapi
      .detectSingleFace(imageElm, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (singleResult) {
      const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor);
      console.log(bestMatch.toString());
    }else{
      console.log('not found single');
      
    }
  }
}
