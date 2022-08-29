import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceMatchComponent } from './face-match/face-match.component';
import { FaceapiComponent } from './faceapi/faceapi.component';
import { WebcamComponent } from './webcam/webcam.component';

const routes: Routes = [
  {
    path: 'WebCam', component: WebcamComponent
  },
  {
    path: 'faceApi', component: FaceapiComponent
  },
  {
    path: 'faceMatch', component: FaceMatchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }