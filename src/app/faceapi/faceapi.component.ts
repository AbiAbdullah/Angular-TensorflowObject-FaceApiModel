import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var faceapi: any;

@Component({
  selector: 'app-faceapi',
  templateUrl: './faceapi.component.html',
  styleUrls: ['./faceapi.component.scss']
})



export class FaceapiComponent implements OnInit {

  // @ViewChild('imageContent') imageContent: ElementRef;
  @ViewChild('video') video!: ElementRef;
  predictedAges = <any>[];
  
  constructor() { 
    // Promise.all([
    //   faceapi.nets.tinyFaceDetector.loadFromUri("assets/models"),
    //   faceapi.nets.faceLandmark68Net.loadFromUri("assets/models"),
    // ]);
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.startVideo();
  }

 // test for video 

  startVideo(){
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const webCamPromise = navigator.mediaDevices.getUserMedia({ 
        audio: false,
            video: {
              facingMode: 'user',
            }
          }).then(stream => {
            this.video.nativeElement.srcObject = stream
           
            return new Promise((resolve, reject) => {
              this.video.nativeElement.onloadedmetadata = () => {
                this.video.nativeElement.play();
                resolve(true);
              };
            });
            
          });
          Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("assets/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("assets/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("assets/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("assets/models"),
          faceapi.nets.ageGenderNet.loadFromUri("assets/models"), webCamPromise])
          .then((values) => {
          
         this.detectFrame();
          })
          .catch((error) => {
            console.error(error);
          });
    }
  }
  
  detectFrame() {
      const canvas = faceapi.createCanvasFromMedia(this.video.nativeElement);
      const divContent = document.getElementById('canvas-content');
      // this.video.nativeElement.appendChild(canvas);
      // document.body.append(canvas);
      divContent!.append(canvas);
    
      const displaySize = { width: this.video.nativeElement.width, height: this.video.nativeElement.height };
      faceapi.matchDimensions(canvas, displaySize);
    
      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(this.video.nativeElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        console.log(detections);
        
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        canvas.getContext('2d').drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height)
    
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    
        const age = resizedDetections[0].age;
        const interpolatedAge = this.interpolateAgePredictions(age);
        const bottomRight = {
          x: resizedDetections[0].detection.box.bottomRight.x - 50,
          y: resizedDetections[0].detection.box.bottomRight.y
        };
    
        new faceapi.draw.DrawTextField(
          [`${faceapi.utils.round(interpolatedAge, 0)} years`],
          bottomRight
        ).draw(canvas);
      }, 100);
  
  
  }
  
  
  
   interpolateAgePredictions(age: any) {
    this.predictedAges = [age].concat(this.predictedAges).slice(0, 30);
    const avgPredictedAge =
     this. predictedAges.reduce((total: any, a: any) => total + a) / this.predictedAges.length;
    return avgPredictedAge;
  }

}
