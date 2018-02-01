import { TestBed, inject } from '@angular/core/testing';

import { CompleterService } from './completer.service';

describe('CompleterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompleterService]
    });
  });

  it('should be created', inject([CompleterService], (service: CompleterService) => {
    expect(service).toBeTruthy();
  }));
});
