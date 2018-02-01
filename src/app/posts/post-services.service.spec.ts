import { TestBed, inject } from '@angular/core/testing';

import { PostServicesService } from './post-services.service';

describe('PostServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostServicesService]
    });
  });

  it('should be created', inject([PostServicesService], (service: PostServicesService) => {
    expect(service).toBeTruthy();
  }));
});
