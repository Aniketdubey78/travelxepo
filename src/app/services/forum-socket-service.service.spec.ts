import { TestBed } from '@angular/core/testing';

import { ForumSocketServiceService } from './forum-socket-service.service';

describe('ForumSocketServiceService', () => {
  let service: ForumSocketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForumSocketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
