import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaveComponent } from './cave.component';

describe('CaveComponent', () => {
  let component: CaveComponent;
  let fixture: ComponentFixture<CaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
