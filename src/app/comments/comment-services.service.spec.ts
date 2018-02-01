import { TestBed, inject } from '@angular/core/testing';

import { CommentServicesService } from './comment-services.service';

describe('CommentServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentServicesService]
    });
  });

  it('should be created', inject([CommentServicesService], (service: CommentServicesService) => {
    expect(service).toBeTruthy();
  }));
});
