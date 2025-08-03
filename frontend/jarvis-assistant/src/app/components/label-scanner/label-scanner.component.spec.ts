import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelScannerComponent } from './label-scanner.component';

describe('LabelScannerComponent', () => {
  let component: LabelScannerComponent;
  let fixture: ComponentFixture<LabelScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelScannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabelScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
