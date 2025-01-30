import { TestBed } from '@angular/core/testing';

import { UsageDetailsServiceService } from './usage-details-service.service';

describe('UsageDetailsServiceService', () => {
  let service: UsageDetailsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsageDetailsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
