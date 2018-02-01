import { TestBed, inject } from '@angular/core/testing';

import { HttpServicesService } from './http-services.service';

describe('AppServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpServicesService]
    });
  });

  it('should be created', inject([HttpServicesService], (service: HttpServicesService) => {
    expect(service).toBeTruthy();
  }));
});
