import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JarvisElecComponent } from './jarvis-elec.component';

describe('JarvisElecComponent', () => {
  let component: JarvisElecComponent;
  let fixture: ComponentFixture<JarvisElecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JarvisElecComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JarvisElecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
