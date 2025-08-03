import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraOcrComponent } from './camera-ocr.component';

describe('CameraOcrComponent', () => {
  let component: CameraOcrComponent;
  let fixture: ComponentFixture<CameraOcrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraOcrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CameraOcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
