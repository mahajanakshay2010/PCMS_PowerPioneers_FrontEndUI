import { TestBed } from '@angular/core/testing';

import { BillGenerationService } from './bill-generation.service';

describe('BillGenerationService', () => {
  let service: BillGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
