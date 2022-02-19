import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceapiComponent } from './faceapi/faceapi.component';
import { WebcamComponent } from './webcam/webcam.component';

const routes: Routes = [
  {
    path: 'WebCam', component: WebcamComponent
  },
  {
    path: 'faceApi', component: FaceapiComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }