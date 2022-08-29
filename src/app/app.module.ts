import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebcamComponent } from './webcam/webcam.component';
import { FaceapiComponent } from './faceapi/faceapi.component';
import { FaceMatchComponent } from './face-match/face-match.component';


@NgModule({
  declarations: [
    AppComponent,
    WebcamComponent,
    FaceapiComponent,
    FaceMatchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
