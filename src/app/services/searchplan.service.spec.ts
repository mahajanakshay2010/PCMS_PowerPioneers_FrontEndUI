import { TestBed } from '@angular/core/testing';

import { SearchplanService } from './searchplan.service';

describe('SearchplanService', () => {
  let service: SearchplanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchplanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
