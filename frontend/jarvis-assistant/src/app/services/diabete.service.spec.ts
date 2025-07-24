import { TestBed } from '@angular/core/testing';

import { DiabeteService } from './diabete.service';

describe('DiabetesService', () => {
  let service: DiabeteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiabeteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
