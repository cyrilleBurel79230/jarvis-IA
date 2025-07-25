import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaveMapComponent } from './cave-map.component';

describe('CaveMapComponent', () => {
  let component: CaveMapComponent;
  let fixture: ComponentFixture<CaveMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaveMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaveMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
