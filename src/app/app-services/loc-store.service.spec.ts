import { TestBed, inject } from '@angular/core/testing';

import { LocStoreService } from './loc-store.service';

describe('LocStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocStoreService]
    });
  });

  it('should be created', inject([LocStoreService], (service: LocStoreService) => {
    expect(service).toBeTruthy();
  }));
});
