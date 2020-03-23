import { TestBed } from '@angular/core/testing';

import { FeedManagerService } from './feed-manager.service';

describe('FeedManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeedManagerService = TestBed.inject(FeedManagerService);
    expect(service).toBeTruthy();
  });
});
