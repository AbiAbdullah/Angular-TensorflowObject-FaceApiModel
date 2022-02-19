import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
// @ts-ignore

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss'],
})
export class WebcamComponent implements OnInit, AfterViewInit {
  @ViewChild('videoCamera')
  videoCamera!: ElementRef;
  @ViewChild('canvas')
  canvas!: ElementRef;
  @ViewChild("streaming") streamingcanvas!: ElementRef;

  names = ['guns', 'knifes', 'scissors'];
  map = new Map();
  model: any;

  modelWeight = 640;
  modelHeight = 640;

  constructor() {}

  ngOnInit(): void {
    for (var i = 0; i < 100; ++i) {
      this.map.set(this.names[i], 0);
    }
  }
  
  ngAfterViewInit(){
    this.webcam_init();
  }

  webcam_init() {
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: 'user',
          },
        })
        .then((stream) => {
          this.videoCamera.nativeElement.srcObject = stream;

          return new Promise((resolve, reject) => {
            this.videoCamera.nativeElement.onloadedmetadata = () => {
              this.videoCamera.nativeElement.play();
              resolve(true);
            };
          });
        });

      const modelPromise = this.predictWithModel();
   
      Promise.all([modelPromise, webCamPromise])
        .then((values) => {
          this.model = values[0];
       this.detectFrame(this.videoCamera.nativeElement, values[0]);
        })
        .catch((error) => {
          console.error(error);
        });
     }
  }

predictWithModel() {
    const weights =
      'https://raw.githubusercontent.com/Aukerul-Shuvo/GKS/main/model.json';
     return tf.loadGraphModel(weights);
  }

  detectFrame = (video: any, model: any) => {
    tf.engine().startScope();
    const input = tf.tidy(() => {
      return tf.image
        .resizeBilinear(tf.browser.fromPixels(video).toInt(), [
          this.modelWeight,
          this.modelHeight,
        ])
        .div(255.0)
        .expandDims(0);
    });

    this.model.executeAsync(input).then((predictions: any) => {
      this.renderPredictions(predictions);

      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
      tf.engine().endScope();
    });
  };

  renderPredictions = (predictions: any) => {

    const c = this.canvas.nativeElement;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Font options.
    const font = '16px sans-serif';
    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.drawImage(this.videoCamera.nativeElement, 0, 0, 640, 640);

    const [boxes, scores, classes, valid_detections] = predictions;
    const boxes_data = boxes.dataSync();
    const scores_data = scores.dataSync();
    const classes_data = classes.dataSync();
    const valid_detections_data = valid_detections.dataSync()[0];

    var i;

    for (i = 0; i < valid_detections_data; ++i) {
      let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
      x1 *= c.width;
      x2 *= c.width;
      y1 *= c.height;
      y2 *= c.height;

      const width = x2 - x1;
      const height = y2 - y1;
      const klass = this.names[classes_data[i]];
      const score = scores_data[i].toFixed(4);

      // Draw the bounding box.
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 4;
      ctx.strokeRect(x1, y1, width, height);

      // Draw the label background.
      ctx.fillStyle = '#00FFFF';
      const textWidth = ctx.measureText(klass + ':' + score).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x1, y1, textWidth + 4, textHeight + 4);
    }
    // var counter=[0],counterk=[];
    for (i = 0; i < valid_detections_data; ++i) {
      let [x1, y1, ,] = boxes_data.slice(i * 4, (i + 1) * 4);
      x1 *= c.width;
      y1 *= c.height;
      const klass = this.names[classes_data[i]];
      const score = scores_data[i].toFixed(2);

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = '#000000';
      ctx.fillText(klass + ':' + score, x1, y1);

      var value = this.map.get(klass);
      this.map.set(klass, value + 1); // incrementing value
    }
    for (const [key, value] of this.map) {
      if (value > 0) {
        console.log(key + ' = ' + value);
      }
    }
   
  };
}
