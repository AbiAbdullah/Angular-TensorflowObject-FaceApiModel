import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceapiComponent } from './faceapi.component';

describe('FaceapiComponent', () => {
  let component: FaceapiComponent;
  let fixture: ComponentFixture<FaceapiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceapiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceapiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
